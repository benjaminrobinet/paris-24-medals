import { gsap } from "gsap/all";
import { AmbientLight, Color, DirectionalLight, Group, MeshPhysicalMaterial, Object3D, PointLight, Raycaster, Vector2, Vector3 } from "three";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";
import { expDecay } from "~/libraries/maths/Utils";
import type { App } from "../App";
import { CursorMode } from "../core/Input";
import { Scene } from "./Scene";

type Item = {
    continent: string;
    object: null | Object3D;
    pointerObject: null | Object3D;
    cylinderWrapperObject: Object3D;
    cylinderObject: null | Object3D;
    color: Color;
    wrapper: Object3D;
};

export class Olympics extends Scene {
    raycaster: Raycaster;
    pointer: Vector2;
    light: PointLight | null = null;
    logo: Object3D | null = null;
    items: Item[];
    activeItem: Item | null;
    focusItem: Item | null;
    pointerFocus: Vector2;
    medals: Object3D | null = null;
    medalsPosition: Vector3;
    config: { colors: { pick: Color; focus: Color }; medals: { positions: { from: Vector3; to: Vector3 } } };
    medalItems: { name: string; wrapper: Object3D | null; object: Object3D | null; text: Object3D | null }[];

    constructor(app: App) {
        super(app);

        this.pointer = new Vector2();
        this.pointerFocus = new Vector2();

        this.items = [
            {
                continent: "America",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                cylinderWrapperObject: new Object3D(),
                color: new Color(0xf0282d),
                wrapper: new Group(),
            },
            {
                continent: "Africa",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                cylinderWrapperObject: new Object3D(),
                color: new Color(0x3f3f3f),
                wrapper: new Group(),
            },
            {
                continent: "Europe",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                cylinderWrapperObject: new Object3D(),
                color: new Color(0x0078d0),
                wrapper: new Group(),
            },
            {
                continent: "Oceania",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                cylinderWrapperObject: new Object3D(),
                color: new Color(0x00a651),
                wrapper: new Group(),
            },
            {
                continent: "Asia",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                cylinderWrapperObject: new Object3D(),
                color: new Color(0xffb114),
                wrapper: new Group(),
            },
        ];

        this.medalItems = [
            {
                name: "Gold",
                wrapper: null,
                object: null,
                text: null,
            },
            {
                name: "Silver",
                wrapper: null,
                object: null,
                text: null,
            },
            {
                name: "Bronze",
                wrapper: null,
                object: null,
                text: null,
            },
        ];

        this.activeItem = null;
        this.focusItem = null;

        this.config = {
            colors: {
                pick: new Color(0xc29cd8).convertLinearToSRGB(),
                focus: new Color(0x0a050c).convertLinearToSRGB(),
            },
            medals: {
                positions: {
                    from: new Vector3(0, -3.5, 0),
                    to: new Vector3(0, 0, 0),
                },
            },
        };

        this.medalsPosition = new Vector3().copy(this.config.medals.positions.from);

        this.raycaster = new Raycaster();
    }

    override ready() {
        this.instance.environment = this.app.modules.assets!.assets.envMap.studio;
        this.instance.background = new Color(this.config.colors.pick);

        this.logo = this.app.modules.assets!.assets.models.olympics.clone();
        this.medals = this.app.modules.assets!.assets.models.medals.clone();

        this.medals!.position.copy(this.config.medals.positions.from);

        this.medals.children.forEach((obj) => {
            const item = this.medalItems.find((i) => i.name === obj.name);
            item!.object = obj;

            switch (obj.name) {
                case "Silver":
                    obj.position.x = -1;
                    obj.position.y = -0.2;
                    break;
                case "Bronze":
                    obj.position.x = 1;
                    obj.position.y = -0.2;
                    break;
            }

            obj.traverse((child) => {
                if (child.name.startsWith("Medal")) {
                    child.material.envMap = this.app.modules.assets!.assets.envMap.default;
                }

                if (child.name.startsWith("Text")) {
                    item!.text = child;
                    item!.text.visible = false;
                }

                if (child.name.startsWith("Wrapper")) {
                    item!.wrapper = child;
                }
            });
        });

        const light = new AmbientLight(0xffffff, 2);
        const light2 = new DirectionalLight(0x9f9f9f, 3);
        const light4 = new PointLight(0xffffff, 1.5);
        const light5 = new PointLight(0xffffff, 1.5);

        this.light = new PointLight(0xeeeeee, 2, 2);

        light.position.z = 5;
        light2.position.z = 5;
        light4.position.z = 1;
        light4.position.x = -1.5;
        light5.position.z = 1;
        light5.position.x = 1.5;
        this.light.position.z = 0.5;

        this.instance.add(light);
        this.instance.add(light2);
        this.instance.add(light4);
        this.instance.add(light5);
        this.instance.add(this.light);
        this.instance.add(this.logo);
        this.instance.add(this.medals);

        this.logo.children.forEach((child) => {
            const item = this.items.find((i) => i.continent === child.name);
            if (!item) return;

            item.object = child;

            item.object.children.forEach((sChild) => {
                if (sChild.name.startsWith("Circle")) {
                    sChild.visible = false;

                    item.pointerObject = sChild;
                }

                if (sChild.name.startsWith("Cylinder")) {
                    item.cylinderObject = sChild;
                    item.cylinderObject.material.transparent = true;
                    item.cylinderObject.material.metalness = 0.75;
                    item.cylinderObject.material.roughness = 0.35;
                    item.cylinderObject.material.color.copy(item.color);
                }
            });
        });

        this.medalItems.forEach((item, i) => {
            const tl = gsap.timeline({
                yoyo: true,
                repeat: -1,
                delay: i,
            });
            tl.fromTo(item.wrapper!.position, { y: -0.02 }, { y: 0.02, duration: 3, ease: "power1.inOut" }, 0);
            tl.fromTo(item.wrapper!.rotation, { x: Math.PI * 0.01 }, { x: -Math.PI * 0.01, duration: 3, ease: "power1.inOut" }, 0);
        });
    }

    onClick = () => {
        this.raycaster.setFromCamera(this.app.modules.input!.pointer, this.app.modules.renderer!.camera);

        const intersects = this.raycaster.intersectObjects(this.items.map((item) => item.object!).flat());

        if (intersects.length && !this.focusItem) {
            const item = this.items.find((item) => item.object === intersects[0].object.parent);

            if (item) {
                this.setFocusItem(item);
            }
        } else {
            this.setFocusItem(null);
            this.setActiveItem(null);
        }
    };

    onUpdate: TickerHandler = ({ dt }) => {
        this.light!.position.set(this.pointer.x * (1 / 0.5), this.pointer.y * (1 / 0.75), this.light!.position.z);

        this.pointer.x = expDecay(this.pointer.x, this.app.modules.input!.pointer.x, 8, dt);
        this.pointer.y = expDecay(this.pointer.y, this.app.modules.input!.pointer.y, 8, dt);

        this.logo!.rotation.y = this.pointer.x * 0.03 * Math.PI;
        this.logo!.rotation.x = this.pointer.y * -0.03 * Math.PI;
    };

    onMove = () => {
        this.raycaster.setFromCamera(this.app.modules.input!.pointer, this.app.modules.renderer!.camera);

        const intersects = this.raycaster.intersectObjects(this.items.map((item) => item.object!).flat());

        if (this.focusItem) {
            this.app.modules.input!.cursor = CursorMode.POINTER;
        } else {
            this.app.modules.input!.cursor = CursorMode.DEFAULT;
        }

        if (this.focusItem) return;

        if (intersects.length) {
            const item = this.items.find((item) => item.object === intersects[0].object.parent);

            if (item) {
                this.app.modules.input!.cursor = CursorMode.POINTER;
                this.setActiveItem(item);
            }
        } else {
            this.setActiveItem(null);
        }
    };

    setActiveItem(item: Item | null) {
        if (this.activeItem === item) return;
        const previousItem = this.activeItem;
        this.activeItem = item;

        this.app.store.setHoverContinent(this.activeItem?.continent || null);

        if (previousItem) {
            gsap.to(previousItem.cylinderObject!.material.color, {
                r: previousItem.color.r,
                g: previousItem.color.g,
                b: previousItem.color.b,
                ease: "power3.out",
                duration: 0.5,
                overwrite: true,
            });
        }

        if (this.activeItem) {
            const otherItems = this.items.filter((item) => item !== this.activeItem);
            const white = new Color(0xffffff);

            gsap.to(this.activeItem.cylinderObject!.material.color, {
                r: this.activeItem.color.r,
                g: this.activeItem.color.g,
                b: this.activeItem.color.b,
                ease: "power3.out",
                duration: 0.5,
            });

            gsap.to(
                otherItems.map((i) => i.cylinderObject!.material.color),
                {
                    r: white.r,
                    g: white.g,
                    b: white.b,
                    ease: "power3.out",
                    duration: 0.5,
                },
            );

            gsap.to(this.activeItem.cylinderObject.material, {
                opacity: 1,
            });
        } else {
            gsap.to(
                this.items.map((i) => i.cylinderObject!.material.color),
                {
                    r: (i: number) => {
                        return this.items[i].color.r;
                    },
                    g: (i: number) => this.items[i].color.g,
                    b: (i: number) => this.items[i].color.b,
                },
            );
        }
    }

    setFocusItem(item: Item | null) {
        if (this.focusItem === item) return;
        const previousItem = this.focusItem;
        this.focusItem = item;

        this.app.store.setCurrentContinent(this.focusItem?.continent || null);

        if (previousItem) {
            const tl = gsap.timeline();

            tl.add(this.hideMedals(), 0);

            tl.to(
                previousItem.object!.position,
                {
                    x: 0,
                    y: 0,
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                0,
            );

            tl.to(
                this.logo!.position,
                {
                    y: 0,
                    z: 0,
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                "<",
            );

            tl.to(
                this.logo!.scale,
                {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                "<",
            );
        }

        if (this.focusItem) {
            const tl = gsap.timeline();

            const otherItems = this.items.filter((i) => i !== this.focusItem);

            this.focusItem!.cylinderObject!.renderOrder -= 1;

            tl.set(
                otherItems.map((i) => i.cylinderObject),
                { renderOrder: 0 },
            );

            tl.add(this.showMedals(), 0);

            tl.to(
                this.instance.background,
                {
                    r: this.config.colors.focus.r,
                    g: this.config.colors.focus.g,
                    b: this.config.colors.focus.b,
                },
                0,
            );

            tl.to(
                this.logo!.position,
                {
                    z: -2,
                    y: 0.5,
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                "<",
            );

            // tl.to(
            //     this.logo!.scale,
            //     {
            //         x: 0.5,
            //         y: 0.5,
            //         z: 0.5,
            //         ease: "expo.inOut",
            //         duration: 1.2,
            //     },
            //     "<",
            // );
        } else {
            gsap.to(
                this.items.map((i) => i.cylinderObject!.material),
                { opacity: 1, delay: previousItem ? 1 : 0 },
            );
        }
    }

    showMedals() {
        const tl = gsap.timeline();

        tl.fromTo(
            [...this.medalItems.map((i) => i.object.rotation)].reverse(),
            {
                y: Math.PI,
            },
            {
                y: Math.PI * 2,
                stagger: 0.15,
                ease: "power4.inOut",
                duration: 2,
                overwrite: "auto",
            },
            "<",
        );

        tl.to(
            this.medals!.position,
            {
                x: this.config.medals.positions.to.x,
                y: this.config.medals.positions.to.y,
                z: this.config.medals.positions.to.z,
                stagger: 0.2,
                ease: "power4.out",
                duration: 2.5,
                overwrite: "auto",
            },
            0.2,
        );

        return tl;
    }

    hideMedals() {
        const tl = gsap.timeline();

        tl.to(this.instance.background, {
            r: this.config.colors.pick.r,
            g: this.config.colors.pick.g,
            b: this.config.colors.pick.b,
        });

        tl.to(
            this.medals!.position,
            {
                x: this.config.medals.positions.from.x,
                y: this.config.medals.positions.from.y,
                z: this.config.medals.positions.from.z,
                ease: "power2.in",
                duration: 0.8,
                overwrite: "auto",
            },
            "<",
        );

        tl.to(
            this.medalItems.map((item) => item.object!.rotation),
            {
                y: 0,
                stagger: 0.1,
                ease: "power2.in",
                duration: 0.8,
                overwrite: "auto",
            },
            "<",
        );

        return tl;
    }

    override mounted() {
        getDefaultTicker().add(this.onUpdate);
        this.app.modules.input!.on("click", this.onClick);
        this.app.modules.input!.on("move", this.onMove);
    }

    override destroy() {
        getDefaultTicker().remove(this.onUpdate);
        this.app.modules.input!.off("click", this.onClick);
        this.app.modules.input!.off("move", this.onMove);
    }
}

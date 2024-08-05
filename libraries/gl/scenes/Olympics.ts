import { Group, HemisphereLight, Mesh, MeshPhysicalMaterial, Object3D, RectAreaLight, Vector3 } from "three";
import { AmbientLight, Color, DirectionalLight, PointLight, PointLightHelper, Raycaster, Vector2 } from "three";
import { Scene } from "./Scene";
import type { App } from "../App";
import { getDefaultTicker } from "~/libraries/Ticker";
import { expDecay } from "~/libraries/maths/Utils";
import { CursorMode } from "../core/Input";
import { gsap } from "gsap/all";

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
    light: PointLight | undefined;
    logo: Object3D | undefined;
    items: Item[];
    activeItem: Item | null;
    focusItem: Item | null;
    pointerFocus: Vector2;

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

        this.activeItem = null;
        this.focusItem = null;

        this.raycaster = new Raycaster();
    }

    override ready() {
        this.logo = this.app.modules.assets!.assets.models.olympics.clone();

        const light = new AmbientLight(0xffffff, 3);
        const light2 = new DirectionalLight(0x9f9f9f, 4);
        const light3 = new PointLight(0xeeeeee, 2, 2);
        const light4 = new PointLight(0xffffff, 2);
        const light5 = new PointLight(0xffffff, 2);
        this.light = light3;
        light.position.z = 5;
        light2.position.z = 5;
        light3.position.z = 0.5;
        light4.position.z = 1;
        light4.position.x = -1.5;
        light5.position.z = 1;
        light5.position.x = 1.5;

        this.instance.add(light);
        this.instance.add(light2);
        this.instance.add(light3);
        this.instance.add(light4);
        this.instance.add(light5);
        // this.instance.add(lightHelper);
        this.instance.add(this.logo);

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
                    item.cylinderObject.material.roughness = 0.685;
                    item.cylinderObject.material.color.copy(item.color);

                    // item.cylinderWrapperObject.add(item.cylinderObject);
                }
            });
        });

        this.instance.environment = this.app.modules.assets!.assets.envMap.studio;
        this.instance.background = new Color(0xefefef);
    }

    onClick = () => {
        this.raycaster.setFromCamera(this.app.modules.input!.pointer, this.app.modules.renderer!.camera);

        const intersects = this.raycaster.intersectObjects(this.items.map((item) => item.object!).flat());

        if (intersects.length) {
            const item = this.items.find((item) => item.object === intersects[0].object.parent);

            if (item) {
                this.setFocusItem(item);
            }
        } else {
            this.setFocusItem(null);
            this.setActiveItem(null);
        }
    };

    onUpdate = ({ dt }) => {
        this.light!.position.set(this.pointer.x * (1 / 0.5), this.pointer.y * (1 / 0.75), this.light!.position.z);

        // if (this.focusItem) {
        //     this.pointerFocus.x = expDecay(this.pointerFocus.x, this.app.modules.input!.pointer.x, 8, dt);
        //     this.pointerFocus.y = expDecay(this.pointerFocus.y, this.app.modules.input!.pointer.y, 8, dt);

        //     this.pointer.x = expDecay(this.pointer.x, 0, 8, dt);
        //     this.pointer.y = expDecay(this.pointer.y, 0, 8, dt);
        // } else {
        //     this.pointerFocus.x = expDecay(this.pointerFocus.x, 0, 8, dt);
        //     this.pointerFocus.y = expDecay(this.pointerFocus.y, 0, 8, dt);
        // }

        this.pointer.x = expDecay(this.pointer.x, this.app.modules.input!.pointer.x, 8, dt);
        this.pointer.y = expDecay(this.pointer.y, this.app.modules.input!.pointer.y, 8, dt);

        this.logo!.rotation.y = this.pointer.x * 0.03 * Math.PI;
        this.logo!.rotation.x = this.pointer.y * -0.03 * Math.PI;

        // this.items.forEach((item) => {
        //     item.cylinderObject!.rotation.y = this.pointerFocus.x * -0.03 * Math.PI;
        //     item.cylinderObject!.rotation.x = this.pointerFocus.y * 0.03 * Math.PI;
        // });
    };

    onMove = () => {
        this.raycaster.setFromCamera(this.app.modules.input!.pointer, this.app.modules.renderer!.camera);

        const intersects = this.raycaster.intersectObjects(this.items.map((item) => item.object!).flat());

        this.app.modules.input!.cursor = CursorMode.DEFAULT;

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
        if (this.focusItem) return;
        if (this.activeItem === item) return;
        const previousItem = this.activeItem;
        this.activeItem = item;

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

        if (previousItem) {
            const tl = gsap.timeline();

            tl.to(previousItem.object!.position, {
                x: 0,
                y: 0,
                ease: "expo.inOut",
                duration: 1.2,
            });

            tl.to(
                this.logo!.position,
                {
                    y: 0,
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

            tl.to(
                otherItems.map((i) => i.cylinderObject!.material),
                { opacity: 0, ease: "power3.in", duration: 0.6 },
            );

            tl.to(this.focusItem.object!.position, {
                x: -this.focusItem.cylinderObject!.position.x,
                y: -this.focusItem.cylinderObject!.position.y,
                ease: "expo.inOut",
                duration: 1.2,
            });

            tl.to(
                this.logo!.position,
                {
                    y: 1.8 * (1 / this.app.modules.renderer!.size.ar),
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                "<",
            );

            tl.to(
                this.logo!.scale,
                {
                    x: 0.5,
                    y: 0.5,
                    z: 0.5,
                    ease: "expo.inOut",
                    duration: 1.2,
                },
                "<",
            );

            // tl.to(
            //     this.focusItem.object!.rotation,
            //     {
            //         y: Math.PI * 0.2,
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

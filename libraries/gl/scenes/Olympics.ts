import type { Object3D } from "three";
import { AmbientLight, Color, DirectionalLight, PointLight, PointLightHelper, Raycaster, Vector2 } from "three";
import { Scene } from "./Scene";
import type { App } from "../App";
import { getDefaultTicker } from "~/libraries/Ticker";
import { expDecay } from "~/libraries/maths/Utils";
import { CursorMode } from "../core/Input";
import { gsap } from "gsap/all";

type Item = { continent: string; object: null | Object3D; pointerObject: null | Object3D; cylinderObject: null | Object3D; color: Color };

export class Olympics extends Scene {
    raycaster: Raycaster;
    pointer: Vector2;
    light: PointLight | undefined;
    logo: Object3D | undefined;
    items: Item[];
    activeItem: Item | null;

    constructor(app: App) {
        super(app);

        this.pointer = new Vector2();

        this.items = [
            {
                continent: "America",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                color: new Color(0xf0282d),
            },
            {
                continent: "Africa",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                color: new Color(0x3f3f3f),
            },
            {
                continent: "Europe",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                color: new Color(0x0078d0),
            },
            {
                continent: "Oceania",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                color: new Color(0x00a651),
            },
            {
                continent: "Asia",
                object: null,
                pointerObject: null,
                cylinderObject: null,
                color: new Color(0xffb114),
            },
        ];

        this.activeItem = null;

        this.raycaster = new Raycaster();
    }

    override ready() {
        this.logo = this.app.modules.assets!.assets.models.olympics.clone();

        const light = new AmbientLight(0xeeeeee, 1);
        const light2 = new DirectionalLight(0x666666, 1);
        const light3 = new PointLight(0xeeeeeee, 3, 2);
        this.light = light3;
        light.position.z = 5;
        light2.position.z = 5;
        light3.position.z = 0.5;
        const lightHelper = new PointLightHelper(light3);
        // this.instance.add(light);
        // this.instance.add(light2);
        this.instance.add(light3);
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
                }
            });
        });

        this.instance.environment = this.app.modules.assets!.assets.envMap.studio;
    }

    onClick = () => {};

    onUpdate = ({ dt }) => {
        this.pointer.x = expDecay(this.pointer.x, this.app.modules.input!.pointer.x, 8, dt);
        this.pointer.y = expDecay(this.pointer.y, this.app.modules.input!.pointer.y, 8, dt);

        this.light!.position.set(this.pointer.x * (1 / 0.5), this.pointer.y * (1 / 0.75), this.light!.position.z);

        this.logo!.rotation.y = this.pointer.x * -0.01 * Math.PI;
        this.logo!.rotation.x = this.pointer.y * 0.01 * Math.PI;
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
        if (this.activeItem === item) return;
        const previousItem = this.activeItem;
        this.activeItem = item;
        console.log(item);

        if (previousItem) {
            const white = new Color(0xffffff);
            gsap.to(previousItem.cylinderObject!.material.color, {
                r: white.r,
                g: white.g,
                b: white.b,
                ease: "power3.out",
                duration: 0.5,
            });
        }
        if (this.activeItem) {
            gsap.to(this.activeItem.cylinderObject!.material.color, {
                r: this.activeItem.color.r,
                g: this.activeItem.color.g,
                b: this.activeItem.color.b,
                ease: "power3.out",
                duration: 0.5,
            });
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

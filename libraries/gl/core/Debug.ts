import { CoreModule } from "./CoreModule";
import { getDefaultViewport, type ViewportHandler } from "~/libraries/Viewport";
import type { App } from "../App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import type { BindingApi } from "@tweakpane/core";

export class Debug extends CoreModule {
    controls: OrbitControls;
    pane: Pane | undefined;
    toUpdates: BindingApi[] = [];
    enabled: boolean;

    constructor(app: App) {
        super(app);

        this.enabled = false;

        this.controls = new OrbitControls(this.app.modules.renderer!.camera, this.app.el!);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
        this.controls.enabled = false;
    }

    createPane() {
        this.pane = new Pane();
        this.pane.hidden = !this.enabled;

        this.toUpdates.push(this.pane.addBinding(this.app.modules.renderer!.dof.cocMaterial, "focusDistance", { min: 0, max: 1, step: 0.001 }));
        this.pane.addBinding(this.app.modules.renderer!.dof.cocMaterial, "focalLength", { min: 0, max: 1, step: 0.001 });
        this.pane.addBinding(this.app.modules.renderer!.dof, "bokehScale", { min: 0, max: 5, step: 0.001 });
        this.pane
            .addBinding({ metalness: this.app.scenes.olympics.items[0].cylinderObject.material.metalness }, "metalness", { min: 0, max: 1, step: 0.001 })
            .on("change", (ev) => {
                this.app.scenes.olympics.items.forEach((item) => (item.cylinderObject.material.metalness = ev.value));
            });

        this.pane
            .addBinding({ roughness: this.app.scenes.olympics.items[0].cylinderObject.material.roughness }, "roughness", { min: 0, max: 1, step: 0.001 })
            .on("change", (ev) => {
                this.app.scenes.olympics.items.forEach((item) => (item.cylinderObject.material.roughness = ev.value));
            });

        this.app.scenes.olympics.items.forEach((item) => {
            this.pane.addBinding(item, "color", { min: 0, max: 5, step: 0.001, color: { type: "float" } }).on("change", (evt) => {
                item.cylinderObject.material.color.copy(evt.value);
            });
        });

        this.pane.addBinding(this.app.scenes.olympics.instance, "background", { color: { type: "float" } });
        this.pane.addBinding({ orbit: false }, "orbit").on("change", (ev) => {
            this.controls.enabled = ev.value;
        });
    }

    onResize: ViewportHandler = () => {};

    onFrame: TickerHandler = ({ dt }) => {
        this.toUpdates.forEach((toUpdate) => {
            toUpdate.refresh();
        });

        this.controls.update(dt);
    };

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        if (this.pane) {
            this.pane!.hidden = false;
        }
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        if (this.pane) {
            this.pane!.hidden = true;
        }
    }

    onKeyUp = (e: KeyboardEvent) => {
        if (e.key === "d") {
            if (!this.enabled) {
                this.enable();
            } else {
                this.disable();
            }
        }
    };

    setup() {
        this.createPane();
    }

    override init() {}

    override mounted() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.add(this.onResize);
        ticker.add(this.onFrame);
        document.addEventListener("keyup", this.onKeyUp);
    }

    override destroy() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.remove(this.onResize);
        ticker.remove(this.onFrame);
        document.removeEventListener("keyup", this.onKeyUp);

        this.pane?.dispose();
    }
}

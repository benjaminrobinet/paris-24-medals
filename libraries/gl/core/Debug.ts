import { CoreModule } from "./CoreModule";
import { getDefaultViewport, type ViewportHandler } from "~/libraries/Viewport";
import type { App } from "../App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import type { BindingApi } from "@tweakpane/core";

export class Debug extends CoreModule {
    controls: OrbitControls;
    pane: Pane;
    toUpdates: BindingApi[] = [];

    constructor(app: App) {
        super(app);

        this.controls = new OrbitControls(this.app.modules.renderer!.camera, this.app.el!);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;

        this.pane = new Pane();
    }

    createPane() {
        this.toUpdates.push(this.pane.addBinding(this.app.modules.renderer!.dof.cocMaterial, "focusDistance", { min: 0, max: 1, step: 0.001 }));
        this.pane.addBinding(this.app.modules.renderer!.dof.cocMaterial, "focalLength", { min: 0, max: 1, step: 0.001 });
        this.pane.addBinding(this.app.modules.renderer!.dof, "bokehScale", { min: 0, max: 5, step: 0.001 });
    }

    onResize: ViewportHandler = () => {};

    onFrame: TickerHandler = ({ dt }) => {
        this.toUpdates.forEach((toUpdate) => {
            toUpdate.refresh();
        });

        this.controls.update(dt);
    };

    override init() {}

    override mounted() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.add(this.onResize);
        ticker.add(this.onFrame);
    }

    override ready(): Promise<unknown> | void {
        this.createPane();
    }

    override destroy() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.remove(this.onResize);
        ticker.remove(this.onFrame);

        this.pane.dispose();
    }
}

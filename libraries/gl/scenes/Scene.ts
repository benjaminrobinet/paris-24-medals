import { PerspectiveCamera, Scene as ThreeScene } from "three";
import type { App } from "../App";
import { CoreModule } from "../core/CoreModule";

export abstract class Scene extends CoreModule {
    instance: ThreeScene;
    camera: PerspectiveCamera;

    constructor(app: App) {
        super(app);
        this.instance = new ThreeScene();
        this.camera = new PerspectiveCamera();
        this.instance.visible = false;
    }

    override init(): Promise<unknown> | void {
        // this.app.modules.renderer!.scene.add(this.instance);
    }

    enter() {
        this.instance.visible = true;
    }

    leave() {
        this.instance.visible = false;
    }
}

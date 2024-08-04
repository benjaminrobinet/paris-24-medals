import { Scene as ThreeScene } from "three";

export abstract class Scene {
    instance: ThreeScene;

    constructor() {
        this.instance = new ThreeScene();
    }

    enter() {
        this.instance.visible = true;
    }

    leave() {
        this.instance.visible = false;
    }
}

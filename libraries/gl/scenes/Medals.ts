import { AmbientLight, DirectionalLight, PointLight, Raycaster } from "three";
import { Scene } from "./Scene";
import type { App } from "../App";

export class Medals extends Scene {
    constructor(app: App) {
        super(app);
    }

    override ready() {
        const light = new AmbientLight(0xeeeeee, 1);
        const light2 = new DirectionalLight(0x666666, 1);
        const light3 = new PointLight(0xeeeeeee, 1);
        light2.position.z = 5;
        light3.position.z = 3;
        light3.position.x = -1;
        this.instance.add(light);
        this.instance.add(light2);
        this.instance.add(light3);
        this.app.modules.assets!.assets.models.medals.children.forEach((obj, i) => {
            obj.position.z = -(this.app.modules.assets!.assets.models.medals.children.length - 1 + i * 2);
            obj.position.x = i * 0.5;
        });
        this.instance.add(this.app.modules.assets!.assets.models.medals);

        this.instance.environment = this.app.modules.assets!.assets.envMap.default;
    }
}

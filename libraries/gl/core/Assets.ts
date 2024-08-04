import { CoreModule } from "./CoreModule";
import type { App } from "../App";
import { DRACOLoader, EXRLoader, GLTFLoader, KTX2Loader } from "three/examples/jsm/Addons.js";
import assets from "../assets.json";
import { AmbientLight, Color, DataTexture, DirectionalLight, EquirectangularReflectionMapping, Object3D, PointLight } from "three";

export class Assets extends CoreModule {
    loaders: { gltf: GLTFLoader; exr: EXRLoader };
    medals: any;
    assets: { models: { [key: string]: Object3D }; envMap: { [key: string]: DataTexture } };

    constructor(app: App) {
        super(app);

        this.loaders = {
            gltf: new GLTFLoader(),
            exr: new EXRLoader(),
        };

        this.assets = {
            models: {},
            envMap: {},
        };

        const dracoLoader = new DRACOLoader();
        const ktx2Loader = new KTX2Loader();

        dracoLoader.setDecoderPath("/static/draco/");
        ktx2Loader.setTranscoderPath("/static/basis/");
        ktx2Loader.detectSupport(this.app.modules.renderer!.instance);

        this.loaders.gltf.setDRACOLoader(dracoLoader);
        this.loaders.gltf.setKTX2Loader(ktx2Loader);
    }

    async load() {
        await Promise.all(
            assets.models.map(async (modelConfig) => {
                this.assets.models[modelConfig.key] = (await this.loaders.gltf.loadAsync(modelConfig.src)).scene;
            }),
        );

        const city = await import("@pmndrs/assets/hdri/city.exr");

        const hdrTexture = await this.loaders.exr.loadAsync(city.default);
        hdrTexture.mapping = EquirectangularReflectionMapping;

        this.assets.envMap.default = hdrTexture;
    }

    override async init() {
        await this.load();
    }

    override mounted() {}

    override ready = (): Promise<unknown> | void => {
        const light = new AmbientLight(0xeeeeee, 1);
        const light2 = new DirectionalLight(0x666666, 1);
        const light3 = new PointLight(0xeeeeeee, 1);
        light2.position.z = 5;
        light3.position.z = 3;
        light3.position.x = -1;
        this.app.modules.renderer?.scene.add(light);
        this.app.modules.renderer?.scene.add(light2);
        this.app.modules.renderer?.scene.add(light3);
        this.assets.models.medals.children.forEach((obj, i) => {
            obj.position.z = -(this.assets.models.medals.children.length - 1 + i * 2);
            obj.position.x = i * 0.5;
        });
        this.app.modules.renderer?.scene.add(this.assets.models.medals);
    };

    override destroy() {}
}

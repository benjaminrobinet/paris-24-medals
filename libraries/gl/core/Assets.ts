import { CoreModule } from "./CoreModule";
import type { App } from "../App";
import { DRACOLoader, EXRLoader, GLTFLoader, KTX2Loader } from "three/examples/jsm/Addons.js";
import assets from "../assets.json";
import type { DataTexture, Object3D } from "three";
import { EquirectangularReflectionMapping } from "three";

export class Assets extends CoreModule {
    loaders: { gltf: GLTFLoader; exr: EXRLoader };
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
        const studio = await import("@pmndrs/assets/hdri/night.exr");

        const hdrTexture = await this.loaders.exr.loadAsync(city.default);
        hdrTexture.mapping = EquirectangularReflectionMapping;

        const hdrTexture2 = await this.loaders.exr.loadAsync(studio.default);
        hdrTexture2.mapping = EquirectangularReflectionMapping;

        this.assets.envMap.default = hdrTexture;
        this.assets.envMap.studio = hdrTexture2;
    }

    override async init() {
        await this.load();
    }

    override mounted() {}

    override ready = (): Promise<unknown> | void => {};

    override destroy() {}
}

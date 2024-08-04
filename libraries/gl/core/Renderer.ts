import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, ShaderMaterial, SRGBColorSpace, Vector3, WebGLRenderer } from "three";
import { CoreModule } from "./CoreModule";
import { getDefaultViewport, type ViewportHandler } from "~/libraries/Viewport";
import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    ToneMappingEffect,
    SMAAEffect,
    ChromaticAberrationEffect,
    ToneMappingMode,
    DepthOfFieldEffect,
    ShaderPass,
    VignetteEffect,
    VignetteTechnique,
} from "postprocessing";
import type { App } from "../App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";

export class Renderer extends CoreModule {
    instance: WebGLRenderer;
    camera: PerspectiveCamera;
    composer: EffectComposer;
    scene: Scene;
    mesh: any;
    size: { width: number; height: number; ar: number; dpr: number };
    smaa: SMAAEffect;
    chromaticAberration: ChromaticAberrationEffect;
    toneMapping: ToneMappingEffect;
    bloom: BloomEffect;
    dof: DepthOfFieldEffect;
    vignette: VignetteEffect;

    constructor(app: App) {
        super(app);

        console.log(this.app.el);

        this.instance = new WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            canvas: this.app.el!,
        });

        this.instance.setClearColor(0x0f0f0f, 1);

        this.instance.outputColorSpace = SRGBColorSpace;

        this.camera = new PerspectiveCamera(30, 1, 0.1, 100);
        this.camera.position.z = 3;
        this.scene = new Scene();

        this.size = { width: window.innerWidth, height: window.innerHeight, ar: window.innerWidth / window.innerHeight, dpr: window.devicePixelRatio };

        const box = new BoxGeometry(1, 1);

        this.mesh = new Mesh(box, new MeshBasicMaterial({ color: new Color("red") }));

        // this.scene.add(this.mesh);

        this.smaa = new SMAAEffect();
        this.chromaticAberration = new ChromaticAberrationEffect();
        this.toneMapping = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC });
        this.bloom = new BloomEffect({ intensity: 0.3 });
        this.dof = new DepthOfFieldEffect(this.camera, {
            focusDistance: 0.0,
            focalLength: 0.048,
            bokehScale: 2.0,
            height: 480,
        });
        this.vignette = new VignetteEffect({
            darkness: 0.3,
            offset: 0.5,
        });

        this.chromaticAberration.offset.set(0.0004, 0.0004);

        this.composer = new EffectComposer(this.instance);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new EffectPass(this.camera, this.bloom));
        this.composer.addPass(new EffectPass(this.camera, this.chromaticAberration));
        this.composer.addPass(new EffectPass(this.camera, this.dof));
        this.composer.addPass(new EffectPass(this.camera, this.vignette));
        this.composer.addPass(new EffectPass(this.camera, this.toneMapping));
        this.composer.addPass(new EffectPass(this.camera, this.smaa));
    }

    onResize: ViewportHandler = ({ width, height }) => {
        this.size = { width, height, ar: width / height, dpr: window.devicePixelRatio };
        this.instance.setPixelRatio(this.size.dpr);

        this.instance.setSize(this.size.width, this.size.height);
        this.composer.setSize(this.size.width, this.size.height);
        this.smaa.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);

        this.camera.aspect = this.app.el!.offsetWidth / this.app.el!.offsetHeight;
        this.camera.updateProjectionMatrix();
    };

    onFrame: TickerHandler = ({ dt }) => {
        this.composer.render();
    };

    override async init() {}

    override mounted() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.add(this.onResize, undefined, true);
        ticker.add(this.onFrame);
    }

    override ready() {
        this.scene.environment = this.app.modules.assets!.assets.envMap.default;
    }

    override destroy() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.remove(this.onResize);
        ticker.remove(this.onFrame);
    }
}

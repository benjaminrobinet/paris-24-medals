import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SRGBColorSpace, Vector3, WebGLRenderer } from "three";
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
    VignetteEffect,
    SMAAPreset,
    EdgeDetectionMode,
} from "postprocessing";
import type { App } from "../App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";
import { map } from "~/libraries/maths/Utils";

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
    bokehTarget: Vector3;
    renderPass: RenderPass;

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

        this.instance.outputColorSpace = SRGBColorSpace;

        this.camera = new PerspectiveCamera(50, 1, 1, 100);
        this.camera.position.z = 5;
        this.scene = new Scene();

        this.size = { width: window.innerWidth, height: window.innerHeight, ar: window.innerWidth / window.innerHeight, dpr: window.devicePixelRatio };

        const box = new BoxGeometry(1, 1);

        this.mesh = new Mesh(box, new MeshBasicMaterial({ color: new Color("red") }));

        // this.scene.add(this.mesh);

        this.smaa = new SMAAEffect({
            preset: SMAAPreset.HIGH,
            edgeDetectionMode: EdgeDetectionMode.COLOR,
        });

        this.chromaticAberration = new ChromaticAberrationEffect();
        this.toneMapping = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC });
        this.bloom = new BloomEffect({ intensity: 0.2, resolutionX: 1024, resolutionY: 1024 });
        this.dof = new DepthOfFieldEffect(this.camera, {
            focusDistance: 0.0,
            focalLength: 0.048,
            bokehScale: 2.0,
        });

        this.vignette = new VignetteEffect({
            darkness: 0.5,
            offset: 0.5,
        });

        this.renderPass = new RenderPass(this.app.activeScene?.instance || this.scene, this.camera);

        this.chromaticAberration.offset.set(0.0, 0.001);
        this.chromaticAberration.radialModulation = false;

        const smaaEffectPass = new EffectPass(this.camera, this.smaa);
        smaaEffectPass.renderToScreen = true;

        this.composer = new EffectComposer(this.instance);
        this.composer.addPass(this.renderPass);
        this.composer.addPass(new EffectPass(this.camera, this.dof));
        // this.composer.addPass(new EffectPass(this.camera, this.chromaticAberration));
        this.composer.addPass(new EffectPass(this.camera, this.bloom));
        this.composer.addPass(new EffectPass(this.camera, this.vignette));
        this.composer.addPass(new EffectPass(this.camera, this.toneMapping));
        this.composer.addPass(smaaEffectPass);

        this.bokehTarget = new Vector3();
    }

    onResize: ViewportHandler = ({ width, height }) => {
        this.size = { width, height, ar: width / height, dpr: window.devicePixelRatio };
        this.instance.setPixelRatio(this.size.dpr);

        this.instance.setSize(this.size.width, this.size.height);

        this.composer.setSize(this.size.width, this.size.height);
        this.smaa.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);
        this.dof.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);
        this.bloom.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);
        this.vignette.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);
        this.toneMapping.setSize(this.size.width * this.size.dpr, this.size.height * this.size.dpr);

        this.camera.position.z = this.size.ar > 1 ? 5 / this.size.ar : 5;
        this.camera.aspect = this.app.el!.offsetWidth / this.app.el!.offsetHeight;
        this.camera.updateProjectionMatrix();
    };

    onFrame: TickerHandler = ({ dt }) => {
        this.renderPass.mainScene = this.app.activeScene?.instance || this.scene;

        this.dof.cocMaterial.focusDistance = map(this.camera.position.distanceTo(this.bokehTarget), this.camera.near, this.camera.far, 0, 1);

        this.composer.render();
    };

    override async init() {}

    override mounted() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.add(this.onResize, undefined, true);
        ticker.add(this.onFrame);
    }

    override destroy() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.remove(this.onResize);
        ticker.remove(this.onFrame);
    }
}

import { BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { CoreModule } from "./CoreModule";
import { getDefaultViewport, type ViewportHandler } from "~/libraries/Viewport";
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import type { App } from "../App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";

export class Renderer extends CoreModule {
    instance: WebGLRenderer;
    camera: PerspectiveCamera;
    composer: EffectComposer;
    scene: Scene;

    constructor(app: App) {
        super(app);

        console.log(this.app.el);

        this.instance = new WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            alpha: true,
            canvas: this.app.el!,
        });

        this.camera = new PerspectiveCamera(55, 1, 1, 1000);
        this.camera.position.z = 5;
        this.scene = new Scene();

        const box = new BoxGeometry(1, 1);

        const mesh = new Mesh(box, new MeshBasicMaterial({ color: new Color("red") }));

        this.scene.add(mesh);

        this.composer = new EffectComposer(this.instance);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new EffectPass(this.camera, new BloomEffect()));
    }

    onResize: ViewportHandler = () => {
        this.instance.setPixelRatio(window.devicePixelRatio);

        this.instance.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        this.camera.aspect = this.app.el!.offsetWidth / this.app.el!.offsetHeight;
        this.camera.updateProjectionMatrix();
    };

    onFrame: TickerHandler = ({ dt }) => {
        this.composer.render();
    };

    override init() {}

    override mounted() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.add(this.onResize);
        ticker.add(this.onFrame);
    }

    override ready(): Promise<unknown> | void {}

    override destroy() {
        const viewport = getDefaultViewport();
        const ticker = getDefaultTicker();

        viewport.remove(this.onResize);
        ticker.remove(this.onFrame);
    }
}

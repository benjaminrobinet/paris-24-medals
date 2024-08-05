import { Assets } from "./core/Assets";
import { Debug } from "./core/Debug";
import { Input } from "./core/Input";
import { Renderer } from "./core/Renderer";
import { Medals } from "./scenes/Medals";
import { Olympics } from "./scenes/Olympics";
import type { Scene } from "./scenes/Scene";

export class App {
    el: HTMLCanvasElement | null;
    modulesDefinition: { renderer: typeof Renderer; assets: typeof Assets; debug: typeof Debug; input: typeof Input };
    modules: { renderer: Renderer | null; assets: Assets | null; debug: Debug | null; input: Input | null };
    debugEnabled: boolean;
    scenes: { medals: Medals; olympics: Olympics };
    activeScene: Scene | undefined;

    constructor() {
        this.el = null;
        this.modulesDefinition = { renderer: Renderer, assets: Assets, input: Input, debug: Debug };

        this.modules = {
            renderer: null,
            assets: null,
            input: null,
            debug: null,
        };

        this.scenes = {
            medals: new Medals(this),
            olympics: new Olympics(this),
        };

        this.debugEnabled = process.env.NODE_ENV === "development";
    }

    setup({ el }: { el: HTMLCanvasElement }) {
        this.el = el;

        for (const key in this.modulesDefinition) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const moduleClass = this.modulesDefinition[key];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.modules[key] = new moduleClass(this);
        }
    }

    async init() {
        await Promise.all(Object.values(this.modules).map((module) => module!.init?.()));
        await Promise.all(Object.values(this.scenes).map((scene) => scene!.init?.()));
    }

    async mounted() {
        await Promise.all(Object.values(this.modules).map((module) => module!.mounted?.()));
        await Promise.all(Object.values(this.scenes).map((scene) => scene!.mounted?.()));
    }

    async ready() {
        await Promise.all(Object.values(this.modules).map((module) => module!.ready?.()));
        await Promise.all(Object.values(this.scenes).map((scene) => scene!.ready?.()));

        this.modules.debug.setup();

        this.scenes.olympics.enter();
        this.activeScene = this.scenes.olympics;
    }

    destroy() {
        this.el = null;
    }
}

let instance: App;

export const getApp = () => {
    if (!instance) {
        instance = new App();
    }

    return instance;
};

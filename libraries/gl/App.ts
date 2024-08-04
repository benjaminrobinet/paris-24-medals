import { Assets } from "./core/Assets";
import { Debug } from "./core/Debug";
import { Renderer } from "./core/Renderer";

export class App {
    el: HTMLCanvasElement | null;
    modulesDefinition: { renderer: typeof Renderer; assets: typeof Assets; debug: typeof Debug };
    modules: { renderer: Renderer | null; assets: Assets | null; debug: Debug | null };
    debugEnabled: boolean;

    constructor() {
        this.el = null;
        this.modulesDefinition = { renderer: Renderer, assets: Assets, debug: Debug };

        this.modules = {
            renderer: null,
            assets: null,
            debug: null,
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
    }

    async mounted() {
        await Promise.all(Object.values(this.modules).map((module) => module!.mounted?.()));
    }

    async ready() {
        await Promise.all(Object.values(this.modules).map((module) => module!.ready?.()));
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

import type { CoreModule } from "./core/CoreModule";
import { Renderer } from "./core/Renderer";

export class App {
    el: HTMLCanvasElement | null;
    modulesDefinition: [typeof Renderer];
    modules: CoreModule[];
    constructor() {
        this.el = null;
        this.modulesDefinition = [Renderer];
        this.modules = [];
    }

    setup({ el }: { el: HTMLCanvasElement }) {
        this.el = el;
        this.modules = this.modulesDefinition.map((module) => new module(this));
    }

    async init() {
        await Promise.all(this.modules.map((module) => module.init?.()));
    }

    async mounted() {
        await Promise.all(this.modules.map((module) => module.mounted?.()));
    }

    async ready() {
        await Promise.all(this.modules.map((module) => module.ready?.()));
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

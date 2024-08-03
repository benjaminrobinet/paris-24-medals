import type { App } from "../App";

export abstract class CoreModule {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    abstract init(): Promise<unknown> | void;
    abstract mounted(): Promise<unknown> | void;
    abstract ready(): Promise<unknown> | void;
    abstract destroy(): Promise<unknown> | void;
}

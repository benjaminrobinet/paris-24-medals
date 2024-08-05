import EventEmitter from "~/libraries/utils/EventEmitter";
import type { App } from "../App";

export abstract class CoreModule extends EventEmitter {
    app: App;

    constructor(app: App) {
        super();
        this.app = app;
    }

    abstract init(): Promise<unknown> | void;
    abstract mounted(): Promise<unknown> | void;
    abstract ready(): Promise<unknown> | void;
    abstract destroy(): Promise<unknown> | void;
}

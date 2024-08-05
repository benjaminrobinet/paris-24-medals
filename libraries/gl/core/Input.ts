import { Vector2 } from "three";
import type { App } from "../App";
import { CoreModule } from "./CoreModule";
import { createGesture, moveAction } from "@use-gesture/vanilla";

const Gesture = createGesture([moveAction]);

export enum CursorMode {
    DEFAULT = "default",
    POINTER = "pointer",
}

export class Input extends CoreModule {
    gesture: null | ReturnType<typeof Gesture>;
    pointer: Vector2;
    _cursor: CursorMode;

    constructor(app: App) {
        super(app);

        this.app = app;

        this.pointer = new Vector2();

        this.gesture = null;

        this._cursor = CursorMode.DEFAULT;
    }

    get cursor() {
        return this._cursor;
    }

    set cursor(mode: CursorMode) {
        this._cursor = mode;
        this.app.el!.style.cursor = this._cursor;
    }

    override init() {
        this.gesture = Gesture(this.app.el!, {
            onMove: ({ xy: [x, y] }) => {
                this.setFromScreen({ x, y });
                this.emit("move", this);
            },
            onClick: (e) => {
                const [x, y] = [e.event.clientX, e.event.clientY];
                this.setFromScreen({ x, y });
                this.emit("click", this);
            },
        });
    }

    setFromScreen({ x, y }: { x: number; y: number }) {
        this.pointer.set((x / this.app.modules.renderer!.size.width) * 2 - 1, -(y / this.app.modules.renderer!.size.height) * 2 + 1);
    }

    override mounted() {}
    override ready() {}
    override destroy() {
        this.gesture?.destroy();
    }
}

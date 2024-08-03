import { ScrollTrigger } from "gsap/all";
import { throttle } from "throttle-debounce";

export interface ViewportHandler {
    (size: { width: number; height: number }, viewport: Viewport): void;
}

export class Viewport {
    public width: number;
    public height: number;
    public previousWidth: number;
    public previousHeight: number;
    public fakeFullHeight: number;
    public iOS: boolean;
    public isMobile: boolean;
    public breakpoints: { name: string; size: number; active: boolean }[];
    public pointerMatchMedia: MediaQueryList | null;
    private updateFns: { fn: ViewportHandler; priority: number; noThrottle: boolean }[];
    fakeUnits: { svh: number; lvh: number; dvh: number; vh: number };

    constructor() {
        this.width = 0;
        this.height = 0;
        this.previousWidth = 0;
        this.previousHeight = 0;
        this.fakeFullHeight = 0;
        this.iOS = false;
        this.isMobile = false;
        this.breakpoints = [];
        this.pointerMatchMedia = null;
        this.updateFns = [];

        this.fakeUnits = {
            svh: 0,
            lvh: 0,
            dvh: 0,
            vh: 0,
        };

        if (typeof window !== "undefined") {
            this.pointerMatchMedia = window.matchMedia("(hover: hover)");

            this.checkDevice();
        }
    }

    checkDevice() {
        this.iOS =
            ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
            (navigator.userAgent.includes("Mac") && "ontouchend" in document);
        this.isMobile = !this.pointerMatchMedia!.matches || this.iOS;
    }

    getFullVh() {
        const el = document.createElement("div");
        el.style.cssText = "position:fixed;top:0;left:0;height:100vh;";
        document.body.appendChild(el);
        const height = el.offsetHeight;
        document.body.removeChild(el);

        return height;
    }

    internalResize = () => {
        let shouldUpdate = false;

        this.previousWidth = this.width;
        this.previousHeight = this.height;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        if (this.isMobile && this.previousWidth === this.width && this.height <= this.previousHeight) {
            // keep the previous height to avoid useless resize
            this.height = this.previousHeight;
        } else {
            shouldUpdate = true;
        }

        if (this.isMobile) {
            // if in landscape mode
            if (this.width > this.height) {
                this.height = this.getFullVh();

                shouldUpdate = true;
            }
        }

        this.checkBreakpoints();
        this.setProperties();

        return shouldUpdate;
    };

    onResize = () => {
        const shouldUpdate = this.internalResize();

        if (shouldUpdate) {
            this.updateNoThrottle();
            this.updateThrottled();
        }
    };

    updateNoThrottle = () => {
        this.updateFns
            .filter((fn) => fn.noThrottle)
            .forEach((u) =>
                u.fn(
                    {
                        width: this.width,
                        height: this.height,
                    },
                    this,
                ),
            );
    };

    updateThrottled = throttle(100, () => {
        this.updateFns
            .filter((fn) => !fn.noThrottle)
            .forEach((u) =>
                u.fn(
                    {
                        width: this.width,
                        height: this.height,
                    },
                    this,
                ),
            );

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1);
    });

    onPointerChange = (e: MediaQueryListEvent) => {
        this.isMobile = !e.matches || this.iOS;
    };

    setProperties() {
        const fullVh = Math.max(this.height, this.getFullVh());

        document.documentElement.style.setProperty("--vw", document.documentElement.clientWidth * 0.01 + "px");
        document.documentElement.style.setProperty("--vh", `${fullVh / 100}px`);
        document.documentElement.style.setProperty("--dvh", window.innerHeight * 0.01 + "px");
        document.documentElement.style.setProperty("--svh", document.documentElement.clientHeight * 0.01 + "px");
        document.documentElement.style.setProperty("--lvh", `${fullVh / 100}px`);
    }

    checkBreakpoints() {
        for (const breakpoint of this.breakpoints) {
            breakpoint.active = this.width >= breakpoint.size;
        }
    }

    setBreakpoints(breakpoints: { name: string; size: number }[]) {
        this.breakpoints = breakpoints.map((bp) => ({ ...bp, ...{ active: false } }));
    }

    add(fn: ViewportHandler, priority = 0, noThrottle = false, immediate = true) {
        const listener = { fn, priority, noThrottle };

        this.updateFns.push(listener);
        this.updateFns.sort((a, b) => a.priority - b.priority);

        if (immediate) {
            listener.fn(
                {
                    width: this.width,
                    height: this.height,
                },
                this,
            );
        }

        return () => {
            this.remove(fn);
        };
    }

    remove(fn: ViewportHandler) {
        const listenerIndex = this.updateFns.findIndex((u) => u.fn === fn);

        if (listenerIndex !== -1) {
            this.updateFns.splice(listenerIndex, 1);
        }
    }

    start() {
        this.stop();
        window.addEventListener("resize", this.onResize, false);
        this.pointerMatchMedia!.addEventListener("change", this.onPointerChange);
        this.internalResize();

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1);
    }

    stop() {
        window.removeEventListener("resize", this.onResize, false);
        this.pointerMatchMedia!.removeEventListener("change", this.onPointerChange);
    }
}

let viewport: Viewport | null = null;

export const getDefaultViewport = () => {
    if (!viewport) {
        viewport = new Viewport();
    }

    return viewport;
};

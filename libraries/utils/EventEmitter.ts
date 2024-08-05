type Handler = (e: any) => void;

export default class EventEmitter {
    public listeners: Map<string, Set<Handler | undefined>>;
    private _once: Map<string, Set<Handler>>;

    constructor() {
        this.listeners = new Map();
        this._once = new Map();
    }

    /**
     * Emit an event with a given payload
     */
    emit(eventName: string, ...eventPayload: any[]): this {
        this.listeners.get(eventName)?.forEach((eventListener) => {
            eventListener?.apply(null, eventPayload);

            if (this._once.get(eventName)?.has(eventListener!)) {
                this.off(eventName, eventListener);
                this._once.get(eventName)!.delete(eventListener!);
            }
        });

        return this;
    }

    /**
     * Attach an event listener
     */
    on(eventName: string, eventListener: Handler): this {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName)!.add(eventListener);

        return this;
    }

    /**
     * Attach an event listener that will be triggered only once
     */
    once(eventName: string, eventListener: Handler): this {
        if (!this._once.has(eventName)) {
            this._once.set(eventName, new Set());
        }
        this._once.get(eventName)!.add(eventListener);

        return this.on(eventName, eventListener);
    }

    /**
     * Detach an event listener if provided, all if not
     */
    off(eventName: string, eventListener?: Handler): this {
        if (!eventListener) {
            this.listeners.delete(eventName);
            this._once.delete(eventName);
        } else {
            this.listeners.get(eventName)?.delete(eventListener);
            this._once.get(eventName)?.delete(eventListener);
        }

        return this;
    }
}

export const lerp = (a: number, b: number, alpha: number) => {
    return a + alpha * (b - a);
};

/** @see https://stackoverflow.com/a/67219519 **/
export const rLerp = (start: number, end: number, alpha: number) => {
    const CS = lerp(Math.cos(start), Math.cos(end), alpha);
    const SN = lerp(Math.sin(start), Math.sin(end), alpha);
    return Math.atan2(SN, CS);
};

export const damp = (x: number, y: number, lambda: number, dt: number) => {
    return lerp(x, y, 1 - Math.exp(-lambda * dt));
};

export const clamp = (input: number, min: number, max: number): number => {
    return Math.min(Math.max(input, min), max);
};

export const map = (current: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    const mapped: number = ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    return clamp(mapped, outMin, outMax);
};

export const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export const bezier = (t: number, initial: number, p1: number, p2: number, final: number) => {
    return (1 - t) * (1 - t) * (1 - t) * initial + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * final;
};

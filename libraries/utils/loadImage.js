/**
 * @param {HTMLImageElement|string} src
 * @returns {Promise<unknown>}
 */
export const loadImage = (src) => {
    if (src instanceof HTMLImageElement) {
        return new Promise((resolve, reject) => {
            if (src.complete) return resolve(src);
            src.addEventListener("load", () => resolve(src));
            src.onerror = reject;
        });
    }

    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
};

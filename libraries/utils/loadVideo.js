/**
 * @param {HTMLVideoElement} videoElement
 * @returns {Promise<unknown>}
 */
export const loadVideo = (videoElement) => {
    return new Promise((resolve) => {
        if (videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA) {
            resolve();
        } else {
            videoElement.addEventListener("canplaythrough", resolve);
            videoElement.load();

            if (videoElement.autoplay) {
                videoElement.play().catch((err) => console.error(err));
            }
        }
    });
};

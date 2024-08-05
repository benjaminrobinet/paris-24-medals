import { gsap, DrawSVGPlugin } from "gsap/all";

export default defineNuxtPlugin(() => {
    gsap.registerPlugin(DrawSVGPlugin);
});

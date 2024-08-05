import { gsap } from "gsap/all";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

export default defineNuxtPlugin(() => {
    gsap.registerPlugin(DrawSVGPlugin);
});

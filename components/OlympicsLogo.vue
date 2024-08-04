<template>
    <div class="olympics-logo">
        <svg ref="svgEl" xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
            <path fill="#fff" d="M0 0h900v600H0z" />
            <g class="clicks" stroke-width="17.7" fill="transparent">
                <circle cx="232.3" cy="253.5" r="91.6" stroke="#0081C8" @click="focus" />
                <circle cx="450" cy="253.5" r="91.6" stroke="#000" @click="focus" />
                <circle cx="667.7" cy="253.5" r="91.6" stroke="#EE334E" @click="focus" />
                <circle cx="341.2" cy="346.5" r="91.6" stroke="#FCB131" @click="focus" />
                <circle cx="558.8" cy="346.5" r="91.6" stroke="#00a651" @click="focus" />
            </g>
            <g class="logo" fill="none" stroke="#000" stroke-width="17.7">
                <circle cx="232.3" cy="253.5" r="91.6" stroke="#0081C8" />
                <circle cx="450" cy="253.5" r="91.6" />
                <circle cx="667.7" cy="253.5" r="91.6" stroke="#EE334E" />
                <circle cx="341.2" cy="346.5" r="91.6" stroke="#FCB131" />
                <circle cx="558.8" cy="346.5" r="91.6" stroke="#00a651" />
                <path d="M305.6 198.5a91.6 91.6 0 0 1 0 109.9" stroke="#0081C8" />
                <path d="M523.3 198.5a91.6 91.6 0 0 1 0 109.9M450 345a91.6 91.6 0 0 1-55-18.3" />
                <path d="M667.7 345a91.6 91.6 0 0 1-55-18.3" stroke="#EE334E" />
            </g>
            <g class="transi" fill="none" stroke="#000" stroke-width="17.7">
                <circle opacity="0" cx="232.3" cy="253.5" r="91.6" stroke="#0081C8" @click="focus" />
                <circle opacity="0" cx="450" cy="253.5" r="91.6" stroke="#000" @click="focus" />
                <circle opacity="0" cx="667.7" cy="253.5" r="91.6" stroke="#EE334E" @click="focus" />
                <circle opacity="0" cx="341.2" cy="346.5" r="91.6" stroke="#FCB131" @click="focus" />
                <circle opacity="0" cx="558.8" cy="346.5" r="91.6" stroke="#00a651" @click="focus" />
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { gsap, DrawSVGPlugin } from "gsap/all";
const svgEl = ref<SVGElement | null>(null);

gsap.registerPlugin(DrawSVGPlugin);

const focus = (e: MouseEvent) => {
    const tl = gsap.timeline();

    const clicksCircles = [...svgEl.value!.querySelectorAll("g.clicks circle")];
    const transiCircles = [...svgEl.value!.querySelectorAll("g.transi circle")];
    const logoCircles = [...svgEl.value!.querySelectorAll("g.logo circle, g.logo path")];

    const index = clicksCircles.indexOf(e.currentTarget as Element);

    const transiCircle = transiCircles[index];

    tl.to(
        transiCircle,
        {
            opacity: 1,
        },
        0,
    );

    tl.to(
        [clicksCircles],
        {
            drawSVG: "100% 100%",
            stagger: 0.07,
            ease: "expo.inOut",
            duration: 1.2,
        },
        "<",
    );

    tl.to(
        [logoCircles],
        {
            drawSVG: "100% 100%",
            stagger: 0.07,
            ease: "expo.inOut",
            duration: 1.2,
        },
        "<",
    );

    tl.to(
        transiCircle,
        {
            cx: "450",
            cy: "300",
            ease: "expo.inOut",
            duration: 1.2,
        },
        "<0.6",
    );

    tl.to(transiCircle, {
        drawSVG: "100% 100%",
        ease: "expo.inOut",
        duration: 1.2,
    });
};
</script>

<style lang="scss" scoped>
.olympics-logo {
    width: 100%;
}

svg {
    width: 100%;
    height: 100%;

    g.logo {
        pointer-events: none;
    }

    g.transi {
        pointer-events: none;
    }
}
</style>

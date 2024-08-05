<template>
    <div class="olympics-logo">
        <svg ref="svgEl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636.3 293.9">
            <g class="clicks">
                <circle cx="100.45" cy="100.45" r="91.6" fill="rgba(0,0,0,0)" stroke="#0081c8" stroke-width="17.7" @click="focus" />
                <circle cx="318.15" cy="100.45" r="91.6" fill="rgba(0,0,0,0)" stroke="#000" stroke-width="17.7" @click="focus" />
                <circle cx="535.85" cy="100.45" r="91.6" fill="rgba(0,0,0,0)" stroke="#ee334e" stroke-width="17.7" @click="focus" />
                <circle cx="209.35" cy="193.45" r="91.6" fill="rgba(0,0,0,0)" stroke="#fcb131" stroke-width="17.7" @click="focus" />
                <circle cx="426.95" cy="193.45" r="91.6" fill="rgba(0,0,0,0)" stroke="#00a651" stroke-width="17.7" @click="focus" />
            </g>
            <g class="logo">
                <circle cx="100.45" cy="100.45" r="91.6" fill="none" stroke="#0081c8" stroke-width="17.7" />
                <circle cx="318.15" cy="100.45" r="91.6" fill="none" stroke="#000" stroke-width="17.7" />
                <circle cx="535.85" cy="100.45" r="91.6" fill="none" stroke="#ee334e" stroke-width="17.7" />
                <circle cx="209.35" cy="193.45" r="91.6" fill="none" stroke="#fcb131" stroke-width="17.7" />
                <circle cx="426.95" cy="193.45" r="91.6" fill="none" stroke="#00a651" stroke-width="17.7" />
                <path d="M173.75,45.45c24.42,32.56,24.42,77.34,0,109.9" fill="none" stroke="#0081c8" stroke-width="17.7" />
                <path d="M391.45,45.45c24.42,32.56,24.42,77.34,0,109.9M318.15,191.95c-19.83.01-39.13-6.41-55-18.3" fill="none" stroke="#000" stroke-width="17.7" />
                <path d="M535.85,191.95c-19.83.01-39.13-6.41-55-18.3" fill="none" stroke="#ee334e" stroke-width="17.7" />
            </g>
            <g class="transi">
                <circle cx="100.45" cy="100.45" r="91.6" fill="none" stroke="#0081C8" opacity="0" stroke-width="17.7" />
                <circle cx="318.15" cy="100.45" r="91.6" fill="none" stroke="#000" opacity="0" stroke-width="17.7" />
                <circle cx="535.85" cy="100.45" r="91.6" fill="none" stroke="#EE334E" opacity="0" stroke-width="17.7" />
                <circle cx="209.35" cy="193.45" r="91.6" fill="none" stroke="#FCB131" opacity="0" stroke-width="17.7" />
                <circle cx="426.95" cy="193.45" r="91.6" fill="none" stroke="#00a651" opacity="0" stroke-width="17.7" />
            </g>
        </svg>
        <!-- <svg ref="svgEl" xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
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
        </svg> -->
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

    tl.to(transiCircle, {
        attr: {
            cx: 318.15,
            cy: 146.95,
        },
        ease: "expo.inOut",
        duration: 1.2,
    });

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
    height: 100%;
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

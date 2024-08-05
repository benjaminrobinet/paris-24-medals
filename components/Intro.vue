<template>
    <Transition @leave="onLeave">
        <div class="intro" v-if="visible">
            <div class="logo">
                <svg ref="svgEl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636.3 293.9">
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stop-color="#331362" stop-opacity="0.5" />
                            <stop offset="100%" stop-color="#7d84c2" stop-opacity="0.5" />
                        </linearGradient>
                        <mask id="shapeMask">
                            <circle cx="100.45" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                            <circle cx="318.15" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                            <circle cx="535.85" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                            <circle cx="209.35" cy="193.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                            <circle cx="426.95" cy="193.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="636.3" height="293.9" fill="url(#gradient)" mask="url(#shapeMask)" />
                    <!-- <g class="logo">
                        <circle cx="100.45" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                        <circle cx="318.15" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                        <circle cx="535.85" cy="100.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                        <circle cx="209.35" cy="193.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                        <circle cx="426.95" cy="193.45" r="91.6" fill="none" stroke="white" stroke-width="17.7" />
                    </g> -->
                </svg>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { gsap } from "gsap/all";

const el = ref<HTMLElement | null>(null);
const svgEl = ref<SVGElement | null>(null);
const visible = ref<boolean>(true);

const onLeave = (el: HTMLElement, done: () => void) => {
    const tl = gsap.timeline();

    const ar = el.offsetHeight / el.offsetWidth;

    tl.fromTo(
        el,
        {
            clipPath: "inset(0% 0% 0% 0%)",
        },
        {
            clipPath: `inset(5% ${5 * ar}% 5% ${5 * ar}%)`,
            ease: "expo.inOut",
            duration: 1,
        },
    );

    tl.fromTo(
        el,
        {
            clipPath: `inset(5% ${5 * ar}% 5% ${5 * ar}%)`,
        },
        {
            clipPath: `inset(5% ${5 * ar}% 5% ${100 - 5 * ar}%)`,
            ease: "expo.inOut",
            duration: 1,
            immediateRender: false,
        },
    );

    tl.call(done);
};

onMounted(() => {
    const tl = gsap.timeline();

    const viewBox = { width: 636.3, height: 293.9 };

    const circles = svgEl.value!.querySelectorAll("circle");

    tl.set(svgEl.value, { opacity: 1 });

    tl.from(
        circles,
        {
            attr: {
                cx: viewBox.width * 0.5,
                cy: viewBox.height * 0.5,
            },
            ease: "expo.inOut",
            duration: 1.2,
        },
        0.2,
    );

    tl.call(() => {
        visible.value = false;
    });
});
</script>

<style scoped lang="scss">
.intro {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    clip-path: inset(0% 0% 0% 0%);

    .logo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 152rem;
    }

    svg {
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}
</style>

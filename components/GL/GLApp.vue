<template>
    <div class="gl-app">
        <canvas ref="canvasEl" class="canvas" />
        <div class="interface" :class="{ inFocus: store.currentContinent }">
            <div class="continent-name">
                <Transition mode="out-in" @enter="onContinentEnter" @leave="onContinentLeave">
                    <h1 :key="continentTitle" v-html="continentTitle"></h1>
                </Transition>
            </div>
            <div ref="medalsGoldEl" class="titleWrapper">
                <Transition mode="out-in" @enter="onContinentEnter" @leave="onContinentLeave">
                    <h2 v-if="currentMedals" :key="currentMedals?.continentCode" class="title">
                        <span class="medals-count">{{ currentMedals?.gold }}</span>
                        <span class="medals-color">
                            Gold<br />
                            medals
                        </span>
                    </h2>
                </Transition>
            </div>
            <div ref="medalsSilverEl" class="titleWrapper">
                <Transition mode="out-in" @enter="onContinentEnter" @leave="onContinentLeave">
                    <h2 v-if="currentMedals" :key="currentMedals?.continentCode" class="title">
                        <span class="medals-count">{{ currentMedals?.silver }}</span>
                        <span class="medals-color">
                            Silver<br />
                            medals
                        </span>
                    </h2>
                </Transition>
            </div>
            <div ref="medalsBronzeEl" class="titleWrapper">
                <Transition mode="out-in" @enter="onContinentEnter" @leave="onContinentLeave">
                    <h2 v-if="currentMedals" :key="currentMedals?.continentCode" class="title">
                        <span class="medals-count">{{ currentMedals?.bronze }}</span>
                        <span class="medals-color">
                            Bronze<br />
                            medals
                        </span>
                    </h2>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { gsap } from "gsap/all";
import { Vector3 } from "three";
import type { App } from "~/libraries/gl/App";
import { getApp } from "~/libraries/gl/App";
import { getDefaultTicker, type TickerHandler } from "~/libraries/Ticker";
import { splitByContinent } from "~/resources/mapper/map-country-continent";

const { data } = useAsyncData("medals", async () => {
    const resp = await fetch("https://paris24-medals-api.vercel.app/medals");

    const body = await resp.json();

    return await splitByContinent(body.results);
});

const canvasEl = ref<HTMLCanvasElement | null>(null);
const medalsGoldEl = ref<HTMLElement | null>(null);
const medalsSilverEl = ref<HTMLElement | null>(null);
const medalsBronzeEl = ref<HTMLElement | null>(null);

const store = useAppStore();

const app = shallowRef<App | null>(null);

const continentTitle = computed(() => {
    if (store.hoverContinent) return store.hoverContinent;

    return `Select a continent`;
});

const currentMedals = computed(() => {
    return data.value?.find((d) => d.continentName === store.currentContinent) || null;
});

const onUpdate: TickerHandler = () => {
    app.value!.scenes.olympics.medalItems.forEach((item, i) => {
        let el: HTMLElement;
        if (item.name === "Gold") {
            el = medalsGoldEl.value!;
        } else if (item.name === "Silver") {
            el = medalsSilverEl.value!;
        } else {
            el = medalsBronzeEl.value!;
        }

        const position = new Vector3();
        item.text!.getWorldPosition(position);
        position.project(app.value!.modules.renderer!.camera);
        position.x = ((position.x + 1) * window.innerWidth) / 2;
        position.y = (-(position.y - 1) * window.innerHeight) / 2;
        el.style.transform = `translate3d(calc(${position.x}px - 50%), ${position.y}px, 0)`;
    });
};

const onContinentEnter = (el: HTMLElement, done: () => void) => {
    const tl = gsap.timeline();

    tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, ease: "expo.out", duration: 0.8 });

    tl.call(done);
};
const onContinentLeave = (el: HTMLElement, done: () => void) => {
    const tl = gsap.timeline();

    tl.to(el, { yPercent: -100, ease: "power2.in", duration: 0.3 });

    tl.call(done);
};

onMounted(async () => {
    app.value = getApp();
    await app.value.setup({ el: canvasEl.value! });
    await app.value.init();
    await app.value.mounted();
    await app.value.ready();

    getDefaultTicker().add(onUpdate);
});

onBeforeUnmount(() => {
    const app = getApp();

    getDefaultTicker().remove(onUpdate);

    app.destroy();
});
</script>

<style scoped lang="scss">
.gl-app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.interface {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: white;
    overflow: hidden;
    text-transform: uppercase;

    &.inFocus {
        .continent-name {
            color: white;
        }
    }

    .continent-name {
        position: absolute;
        top: 100rem;
        width: 100%;
        left: 0;
        display: flex;
        justify-content: center;
        font-size: 52rem;
        line-height: 1;
        font-weight: bold;
        overflow: hidden;
        transition: color 0.4s $ease-out-sine;
        color: $purple-contrast;
    }

    .titleWrapper {
        position: absolute;
        top: 0;
        left: 0;
    }

    .title {
        text-transform: uppercase;
        will-change: transform;
        font-weight: bold;
        display: flex;
        align-items: center;
        font-size: 16rem;
        line-height: 1;
        gap: 10rem;

        .medals-count {
            font-size: 36rem;
        }
    }
}
</style>

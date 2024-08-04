<template>
    <div class="gl-app">
        <canvas class="canvas" ref="canvasEl"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { getApp } from "~/libraries/gl/App";

const canvasEl = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
    const app = getApp();
    await app.setup({ el: canvasEl.value! });
    await app.init();
    await app.mounted();
    await app.ready();
});

onBeforeUnmount(() => {
    const app = getApp();

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
    // background: black;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

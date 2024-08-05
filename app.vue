<template>
    <div class="app">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <Intro />
    </div>
</template>

<script setup lang="ts">
import { getDefaultTicker } from "./libraries/Ticker";
import { getDefaultViewport } from "./libraries/Viewport";

onMounted(() => {
    const viewport = getDefaultViewport();
    const ticker = getDefaultTicker();

    viewport.start();
    ticker.start();
});
</script>

<style scoped lang="scss"></style>

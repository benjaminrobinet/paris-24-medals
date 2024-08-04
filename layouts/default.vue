<template>
    <div class="layout">
        <div class="gl-wrapper">
            <GLApp />
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    position: relative;
}
</style>

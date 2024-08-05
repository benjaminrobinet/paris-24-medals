<template>
    <div class="layout">
        <div class="content">
            <slot />
        </div>
        <div class="gl-wrapper">
            <GLApp />
        </div>
    </div>
</template>

<style scoped lang="scss">
.gl-wrapper {
    position: relative;
}

.content {
    position: relative;
}
</style>

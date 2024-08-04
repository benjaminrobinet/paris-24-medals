<template>
    <div class="continent-picker">
        <div class="svg-wrapper">
            <OlympicsLogo />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { splitByContinent } from "~/resources/mapper/map-country-continent";
import countryMedals from "~/resources/mocks/get-medals-by-country.json";

const { data } = useAsyncData("medals", async () => {
    return await splitByContinent(countryMedals);
});

onMounted(() => {
    console.log(data);
});
</script>

<style scoped lang="scss">
.continent-picker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
}

.svg-wrapper {
    display: flex;
    overflow: auto;
}
</style>

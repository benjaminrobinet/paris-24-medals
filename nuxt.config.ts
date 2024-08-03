import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxt/eslint"],
    css: ["~/assets/style/app.scss"],
    vite: {
        plugins: [
            svgLoader({
                svgoConfig: {
                    plugins: [
                        {
                            name: "preset-default",
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/style/_main.scss" as *;',
                },
            },
        },
    },
});

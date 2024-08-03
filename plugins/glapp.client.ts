import { App, getApp } from "~/libraries/gl/App";

export default defineNuxtPlugin(() => {
    const app = getApp();

    return {
        provide: {
            gl: app,
        },
    };
});

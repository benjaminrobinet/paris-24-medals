import type { App } from "./libraries/gl/App";

declare module "#app" {
    interface NuxtApp {
        $gl: App;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $gl: App;
    }
}

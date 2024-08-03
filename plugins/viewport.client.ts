import { getDefaultViewport } from "~/libraries/Viewport";

export default defineNuxtPlugin(() => {
  const viewport = getDefaultViewport();

  viewport.setBreakpoints([
    { name: "xs", size: 0 },
    { name: "sm", size: 480 },
    { name: "md", size: 768 },
    { name: "lg", size: 1024 },
    { name: "xlg", size: 1280 },
    { name: "xl", size: 1440 },
    { name: "xxl", size: 1680 },
  ]);
});

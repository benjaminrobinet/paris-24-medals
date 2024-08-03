import { gsap } from "gsap";

export const enter = (main: Element, secondary: Element) => {
    const tl = gsap.timeline();

    tl.fromTo(
        main,
        {
            clipPath: "inset(50% 25% 50% 25%)",
        },
        {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "expo.inOut",
            duration: 1.1,
        },
        "<",
    );

    tl.fromTo(
        secondary,
        {
            clipPath: "inset(50% 25% 50% 25%)",
        },
        {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "expo.inOut",
            duration: 1.1,
        },
        "<0.1",
    );

    return tl;
};

export const leave = (main: Element, secondary: Element) => {
    const tl = gsap.timeline();

    tl.to(secondary, {
        clipPath: "inset(50% 0% 50% 0%)",
        ease: "expo.inOut",
        duration: 1.1,
    });

    tl.to(
        main,
        {
            clipPath: "inset(50% 0% 50% 0%)",
            ease: "expo.inOut",
            duration: 1.1,
        },
        "<0.07",
    );

    return tl;
};

import { gsap, ScrollTrigger } from "gsap/all";
import { wrapElement } from "~/libraries/dom/SplitText";

interface ITextRevealLightOpts {
    fade?: boolean;
    delay?: number;
    paused?: boolean;
    wrap?: boolean;
    useScrollTrigger?: boolean;
    trigger?: Element | null;
}

export const textRevealLight = (
    element: Element,
    opts: ITextRevealLightOpts = {
        fade: false,
        delay: 0,
        paused: false,
        wrap: false,
        useScrollTrigger: true,
        trigger: null,
    },
) => {
    const progress = useState(() => new Map());

    const params = Object.assign(
        {
            fade: false,
            delay: 0,
            paused: false,
            wrap: false,
            useScrollTrigger: true,
            trigger: null,
        },
        opts,
    );

    const tl = gsap.timeline({
        paused: !params.useScrollTrigger && params.paused,
    });

    if (params.wrap) {
        wrapElement(element, "split-line");
    }

    tl.fromTo(
        element,
        {
            yPercent: 100,
            opacity: params.fade ? 0 : undefined,
            willChange: "transform",
        },
        {
            opacity: params.fade ? 1 : undefined,
            yPercent: 0,
            ease: "expo.out",
            duration: 1.2,
        },
        params.delay,
    );

    if (progress.value.has(element)) {
        tl.progress(progress.value.get(element));
    }

    let st;
    if (params.useScrollTrigger) {
        st = ScrollTrigger.create({
            animation: tl,
            start: "top 80%",
            end: "bottom 10%",
            trigger: params.trigger ? params.trigger : element,
            toggleActions: "play none play none",
        });

        if (params.paused) {
            st.disable();
        }
    }

    return {
        tl,
        st,
    };
};

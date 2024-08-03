import { gsap, ScrollTrigger } from "gsap/all";
import { useSplitText } from "~/composables/animations/useSplitText";

const progress = new Map();

interface ITextRevealOpts {
    stagger?: number;
    wordsStagger?: number;
    fade?: boolean;
    delay?: number;
    paused?: boolean;
    autoKill?: boolean;
    dirtyClean?: boolean;
    useScrollTrigger?: boolean;
    trigger?: null | Element;
    direction?: number;
}

export const textReveal = (element: HTMLElement, opts: ITextRevealOpts = {}, splitTextConfig: any = {}) => {
    const params = Object.assign(
        {
            stagger: 0.1,
            wordsStagger: 0,
            fade: false,
            delay: 0,
            paused: false,
            autoKill: false,
            dirtyClean: true,
            useScrollTrigger: true,
            trigger: null,
            direction: 1,
        },
        opts,
    );

    const scope = effectScope();

    return scope.run(() => {
        const { cleanUp, split } = useSplitText(element, splitTextConfig)!;

        const tl = gsap.timeline({
            paused: !params.useScrollTrigger && params.paused,
        });

        watch(
            split,
            (split) => {
                if (tl) {
                    progress.set(element, tl.progress());
                    tl.clear();
                }

                split?.lines
                    .map((line) => line.querySelectorAll(".split-word"))
                    .forEach((lineWords, i) => {
                        tl.fromTo(
                            lineWords,
                            {
                                yPercent: 100 * params.direction,
                                opacity: params.fade ? 0 : undefined,
                            },
                            {
                                opacity: params.fade ? 1 : undefined,
                                yPercent: 0,
                                ease: "expo.out",
                                duration: 1.2,
                                delay: (_, el) => {
                                    return parseFloat(el.parentElement?.dataset.delay) || 0;
                                },
                                willChange: "transform",
                                stagger: params.wordsStagger,
                            },
                            params.delay + i * params.stagger,
                        );
                    });

                if (params.autoKill) {
                    tl.call(() => {
                        cleanUp();
                    });
                }

                if (progress.has(element)) {
                    tl.progress(progress.get(element));
                }
            },
            { immediate: true },
        );

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

        onScopeDispose(() => {
            cleanUp(params.dirtyClean);
        });

        return {
            tl,
            st,
            split,
            clean: () => {
                cleanUp();
            },
        };
    });
};

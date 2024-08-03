import { SplitText } from "gsap/all";
import { nestedSplit } from "~/libraries/dom/nestedSplit";

export const wrapElement = (element: Element, className: string = "extra-split-line") => {
    // Create a new div element
    const wrapper = document.createElement("span");
    wrapper.style.display = "block";
    wrapper.classList.add(className);

    element.parentNode!.replaceChild(wrapper, element);
    wrapper.appendChild(element);
};

export const Split = (
    element: Element,
    vars: SplitText.Vars = {
        type: "lines, words",
        linesClass: "split-line",
        charsClass: "split-char",
        wordsClass: "split-word",
        splitClone: false,
        nested: false,
        debug: false,
        extraLinesWrap: false,
        tag: "span",
    },
) => {
    const defaults = {
        type: "lines, words",
        linesClass: "split-line",
        charsClass: "split-char",
        wordsClass: "split-word",
        splitClone: false,
        nested: false,
        debug: false,
        extraLinesWrap: false,
        tag: "span",
    };

    vars = { ...defaults, ...vars };

    const splittedMap = useState(() => new WeakMap<Element | HTMLElement, SplitText>());

    const elementChildren = [...element.childNodes].filter((node) => node.nodeType !== Node.COMMENT_NODE);

    const target =
        elementChildren.length === 1 && elementChildren[0].nodeType !== Node.TEXT_NODE && elementChildren[0].nodeName !== "SPAN" ? elementChildren[0] : element;

    const sourceElementClone = target.cloneNode(true) as HTMLElement;

    const toSplit = (vars.splitClone ? sourceElementClone : target) as HTMLElement;

    const splitted: { chars: HTMLElement[]; lines: HTMLElement[]; words: HTMLElement[] } = {
        chars: [],
        lines: [],
        words: [],
    };

    let splittedText: SplitText | undefined = splittedMap.value.get(element);

    const revert = () => {
        if (!splittedText) return;

        splittedText.revert();

        if (vars.splitClone) {
            sourceElementClone.replaceWith(target);
        }
    };

    const split = () => {
        revert();

        if (vars.splitClone) {
            target.replaceWith(sourceElementClone);
        }

        splittedText = vars.nested
            ? nestedSplit(toSplit, {
                  type: vars.type,
                  linesClass: vars.linesClass,
                  charsClass: vars.charsClass,
                  wordsClass: vars.wordsClass,
                  tag: vars.tag,
              })
            : new SplitText(toSplit, vars);

        splitted.chars = splittedText.chars as HTMLElement[];
        splitted.lines = splittedText.lines as HTMLElement[];
        splitted.words = splittedText.words as HTMLElement[];

        if (vars.extraLinesWrap) {
            splitted.lines.forEach((line) => {
                wrapElement(line as HTMLElement);
            });
        }

        splittedMap.value.set(element, splittedText);
    };

    split();

    return {
        revert,
        split,
        ...splitted,
    };
};

import { gsap, SplitText } from "gsap/all";

/**
 * @param target
 * @param vars
 * @returns {SplitText}
 */
export function nestedSplit(target, vars) {
    target = gsap.utils.toArray(target);
    if (target.length > 1) {
        const splits = target.map((t) => nestedSplit(t, vars));
        const result = splits[0];
        const resultRevert = result.revert;
        result.lines = splits.reduce((acc, cur) => acc.concat(cur.lines), []);
        result.revert = () => splits.forEach((s) => (s === result ? resultRevert() : s.revert()));
        return result;
    }
    target = target[0];
    const contents = target.innerHTML;
    gsap.utils.toArray(target.children).forEach((child) => {
        const split = new SplitText(child, { type: "lines" });
        split.lines.forEach((line) => {
            const clone = child.cloneNode(false);
            clone.innerHTML = line.innerHTML;
            target.insertBefore(clone, child);
        });
        target.removeChild(child);
    });
    const split = new SplitText(target, vars);
    const originalRevert = split.revert;
    split.revert = () => {
        originalRevert.call(split);
        target.innerHTML = contents;
    };
    return split;
}

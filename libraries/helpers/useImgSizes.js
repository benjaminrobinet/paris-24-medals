/**
 * @param {number|null} mb
 * @param {number|null} dk
 * @returns {string}
 */
export const useImgSizes = (mb = null, dk = null) => {
    const breakpoints = {
        xs: 375,
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1440,
        xxl: 1680,
        "3xl": 1920,
        "4xl": 2560,
    };

    const sizes = {
        fuck: mb,
        xs: Math.round(mb * (breakpoints.sm / breakpoints.xs)),
        sm: Math.round(mb * (breakpoints.md / breakpoints.xs)),
        md: Math.round(mb * (breakpoints.lg / breakpoints.xs)),
        lg: dk,
        xl: Math.round(dk * (breakpoints.xxl / breakpoints.xl)),
        xxl: Math.round(dk * (breakpoints["3xl"] / breakpoints.xl)),
        "3xl": Math.round(dk * (breakpoints["4xl"] / breakpoints.xl)),
        // '4xl': Math.round(dk * (breakpoints['4xl'] / breakpoints.xl)),
    };

    return `fuck:${sizes.fuck} xs:${sizes.xs}px sm:${sizes.sm}px md:${sizes.md}px lg:${sizes.lg}px xl:${sizes.xl}px xxl:${sizes.xxl}px 3xl:${sizes["3xl"]}px`;
};

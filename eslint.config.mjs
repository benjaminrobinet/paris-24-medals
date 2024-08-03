import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: {
        "vue/multi-word-component-names": "off",
        "vue/no-v-text-v-html-on-component": "off",
        "no-use-before-define": "off",
    },
});
// your custom flat configs go here, for example:
// {
//   files: ['**/*.ts', '**/*.tsx'],
//   rules: {
//     'no-console': 'off' // allow console.log in TypeScript files
//   }
// },
// {
//   ...
// }

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  bracketSpacing: true,
  semi: true,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  importOrder: [
    "^(.|~|~~)/(server|lib|trpc)/(.*)$",
    "^(.|~|~~)/components/(.*)$",
    "^(.|~|~~)/public/(.*)$",
    "^(./)(.*)$",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;

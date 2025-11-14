// eslint.config.js

export default [
  {
    ignores: ["**/node_modules/**", ".next/**", "dist/**", "out/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {},
  },
];

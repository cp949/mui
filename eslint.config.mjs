import baseConfig from "./packages/shared-config/eslint-config/index.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ["**/dist/**", "**/node_modules/**", ".turbo/**"],
  },
];
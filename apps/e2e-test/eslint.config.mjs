import { config } from "@repo/eslint-config/react-internal";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".turbo/",
      "playwright-report/",
      "test-results/",
      "public/**",
    ],
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Only include the config itself here; TS config files are already part of the project service.
          allowDefaultProject: ["eslint.config.mjs"],
        },
        tsconfigRootDir,
      },
    },
    rules: {
      // E2E UI pages are intentionally verbose and explicit.
      "no-console": "off",
    },
  },
];



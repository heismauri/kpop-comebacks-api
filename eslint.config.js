import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "app/dist", ".wrangler/*"]),
  {
    files: ["app/src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    rules: {
      "comma-dangle": ["error", "never"],
      "max-len": ["error", { code: 120, ignoreComments: true }],
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  }
]);

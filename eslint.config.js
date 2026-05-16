import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["app/dist", "worker-configuration.d.ts", "test/**", ".wrangler/"]),
  { files: ["**/*.{ts,mts,cts}"], languageOptions: { parser: tseslint.ESLintParser } },
  {
    files: ["app/src/**/*.{ts,tsx}"],
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      globals: globals.browser
    }
  },
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "comma-dangle": ["error", "never"],
      "max-len": ["error", { code: 120, ignoreComments: true }],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  }
]);

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const webFiles = ["apps/web/**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];

function forWeb(configs) {
  return configs.map((config) => {
    if (config.files) return { ...config, files: webFiles };
    const hasRules = config.rules && Object.keys(config.rules).length > 0;
    return hasRules ? { ...config, files: webFiles } : config;
  });
}

export default defineConfig([
  ...forWeb(nextVitals),
  ...forWeb(nextTypescript),
  {
    files: ["apps/api/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  globalIgnores(["**/.next/**", "**/dist/**", "**/node_modules/**", "**/coverage/**"]),
]);

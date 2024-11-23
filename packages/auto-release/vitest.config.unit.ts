import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    include: ["**/__tests__/*.test.ts"],
    coverage: {
      provider: "istanbul",
      exclude: [
        "src/git/stream-git-lines.ts",
        "**/__integration__/**",
        "dist/**",
        "src/index.ts",
        "**/__tests__/**",
        "src/commit-parser/commit-parser.ts",
        "src/logger/*",
      ],
      reporter: ["text", "json", "lcov"],
    },
  },
});

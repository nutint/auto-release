import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    include: ["**/__tests__/*.test.ts"],
  },
});

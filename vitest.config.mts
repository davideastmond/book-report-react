import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",
    setupFiles: "./setup-tests.ts",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    coverage: {
      exclude: [
        "**/*.config.{ts,js,mts,mjs,cjs}",
        "hero.ts",
        "**/*.d.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/setup-tests.ts",
      ],
    },
  },
});

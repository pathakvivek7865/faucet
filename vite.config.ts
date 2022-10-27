import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import { resolve } from "path";

// import EnvironmentPlugin from "vite-plugin-environment";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
    },
  },
});

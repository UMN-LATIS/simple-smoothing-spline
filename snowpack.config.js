import rollupPluginNodePolyfills from "rollup-plugin-node-polyfills";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import { terser } from "rollup-plugin-terser";

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    // src: "/dist",
    example: "/",
    src: "/src",
    dist: "/dist",
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    polyfillNode: true,
    rollup: {
      plugins: [rollupPluginNodePolyfills({ crypto: true })],
    },
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  // alias: {
  //   src: "./src",
  // },
  // rollup: {
  //   plugins: [nodeResolve(), commonjs(), terser()],
  // },
};

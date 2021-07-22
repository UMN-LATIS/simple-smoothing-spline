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
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    polyfillNode: true,
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

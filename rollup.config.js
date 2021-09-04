import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "dist/index.js",
  output: [
    {
      file: "dist/index.mjs",
      sourcemap: true,
      format: "esm",
    },
    {
      file: "dist/index.min.mjs",
      format: "esm",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      sourcemap: true,
      name: "simpleSmoothingSpline",
    },
    {
      file: "dist/index.umd.min.js",
      format: "umd",
      name: "simpleSmoothingSpline",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [nodeResolve({ browser: true }), commonjs()],
};

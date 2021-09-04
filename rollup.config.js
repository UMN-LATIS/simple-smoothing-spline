import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      sourcemap: true,
      format: "esm",
    },
    {
      file: "dist/index.min.js",
      format: "esm",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "dist/index.umd.min.js",
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
  plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
};

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {},
  plugins: [
    /* ... */
  ],
  packageOptions: {
    source: "remote",
    types: true,
    baseUrl: "./",
    paths: { "*": ["types/*"] },
  },
  devOptions: {
    openUrl: "/example/",
  },
  buildOptions: {
    /* ... */
  },
};

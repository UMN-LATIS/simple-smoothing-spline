/**
 * @type {import('vite').UserConfig}
 */
 const config = {
  root: './example',
  build: {
    outDir: './build',
    sourcemap: true,
  },
  define: {
    "global": {},
  }
}

export default config
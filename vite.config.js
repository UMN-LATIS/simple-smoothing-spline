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
  },
  base: '/simple-smoothing-spline/'
}

export default config
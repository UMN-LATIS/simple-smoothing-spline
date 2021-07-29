import generateSmoothingSplineFunction from "./smoothingSpline/generateSmoothingSplineFunction.js";
import generateCubicSplineFunction from "./cubicSpline/generateCubicSplineFunction.js";
import getAllXs from "./helpers/getAllXs.js";
async function generateSplinePoints(splineFn, data) {
  const minX = Math.min(...getAllXs(data));
  const maxX = Math.max(...getAllXs(data));
  const stepSize = (maxX - minX) / 1e3;
  const xs = [...Array(1e3).keys()].map((i) => minX + i * stepSize);
  const splinePoints = await Promise.all([
    ...xs.map((x) => ({x, y: splineFn(x)}))
  ]);
  return splinePoints;
}
export default async function smoothingSpline(data, {lambda = 1e3, type = "smoothing"} = {}) {
  let splineFn;
  if (type === "cubic") {
    splineFn = generateCubicSplineFunction(data);
  } else {
    splineFn = await generateSmoothingSplineFunction(data, {lambda});
  }
  const splinePoints = await generateSplinePoints(splineFn, data);
  return {
    fn: splineFn,
    points: splinePoints
  };
}

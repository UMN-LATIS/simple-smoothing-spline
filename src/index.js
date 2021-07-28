import generateSmoothingSplineFunction from "./smoothingSpline/generateSmoothingSplineFunction.js";
import generateCubicSplineFunction from "./cubicSpline/generateCubicSplineFunction.js";
import getAllXs from "./helpers/getAllXs.js";
function generateSplinePoints(splineFn, data) {
  const splinePoints = [];
  const minX = Math.min(...getAllXs(data));
  const maxX = Math.max(...getAllXs(data));
  const stepSize = (maxX - minX) / 1e3;
  for (let i = minX; i <= maxX; i += stepSize) {
    splinePoints.push({x: i, y: splineFn(i)});
  }
  return splinePoints;
}
export default function smoothingSpline(data, {lambda = 1e3, type = "smoothing"} = {}) {
  let splineFn;
  if (type === "cubic") {
    splineFn = generateCubicSplineFunction(data);
  } else {
    splineFn = generateSmoothingSplineFunction(data, {lambda});
  }
  const splinePoints = generateSplinePoints(splineFn, data);
  return {
    fn: splineFn,
    points: splinePoints
  };
}

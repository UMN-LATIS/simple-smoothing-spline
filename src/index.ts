import generateSmoothingSplineFunction from "./smoothingSpline/generateSmoothingSplineFunction";
import generateCubicSplineFunction from "./cubicSpline/generateCubicSplineFunction";
import getAllXs from "./helpers/getAllXs";
import { Point, SplineFunction } from "./types";

function generateSplinePoints(splineFn: (x: number) => number, data: Point[]) {
  const splinePoints = [];

  const minX = Math.min(...getAllXs(data));
  const maxX = Math.max(...getAllXs(data));
  const stepSize = (maxX - minX) / 1000;

  for (let i = minX; i <= maxX; i += stepSize) {
    splinePoints.push({ x: i, y: splineFn(i) });
  }
  return splinePoints;
}

interface smoothingSplineOptions {
  lambda?: number;
  type?: "smoothing" | "cubic";
}

export default function smoothingSpline(
  data: Point[],
  { lambda = 1000, type = "smoothing" }: smoothingSplineOptions = {}
) {
  let splineFn: (x: number) => number;

  if (type === "cubic") {
    splineFn = generateCubicSplineFunction(data);
  } else {
    splineFn = generateSmoothingSplineFunction(data, { lambda });
  }

  const splinePoints = generateSplinePoints(splineFn, data);
  return {
    fn: splineFn,
    points: splinePoints,
  };
}

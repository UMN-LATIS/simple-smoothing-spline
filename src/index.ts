import generateSmoothingSplineFunction from "./smoothingSpline/generateSmoothingSplineFunction";
import generateCubicSplineFunction from "./cubicSpline/generateCubicSplineFunction";
import getAllXs from "./helpers/getAllXs";
import { Point, SplineFunction } from "./types";

async function generateSplinePoints(
  splineFn: (x: number) => number,
  data: Point[]
) {
  const minX = Math.min(...getAllXs(data));
  const maxX = Math.max(...getAllXs(data));
  const stepSize = (maxX - minX) / 1000;

  const xs = [...Array(1000).keys()].map((i) => minX + i * stepSize);
  const splinePoints = await Promise.all([
    ...xs.map((x) => ({ x, y: splineFn(x) })),
  ]);

  return splinePoints;
}

interface smoothingSplineOptions {
  lambda?: number;
  type?: "smoothing" | "cubic";
}

interface SmoothingSpline {
  fn: SplineFunction;
  points: Point[];
}

export default async function smoothingSpline(
  data: Point[],
  { lambda = 1000, type = "smoothing" }: smoothingSplineOptions = {}
): Promise<SmoothingSpline> {
  let splineFn: SplineFunction;

  if (type === "cubic") {
    splineFn = generateCubicSplineFunction(data);
  } else {
    splineFn = await generateSmoothingSplineFunction(data, { lambda });
  }

  const splinePoints = await generateSplinePoints(splineFn, data);
  return {
    fn: splineFn,
    points: splinePoints,
  };
}

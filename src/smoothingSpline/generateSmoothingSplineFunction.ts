import { Point, SplineFunction } from "../types";
import { createBasisArray, createBasisCol } from "./createBasis";
import solveForBetas from "./solveForBeta";

class InvalidLambdaError extends Error {}

export default async function generateSmoothingSplineFunction(
  data: Point[],
  { lambda }: { lambda: number }
): Promise<SplineFunction> {
  if (lambda <= 0) {
    throw new InvalidLambdaError("lambda must be greater than 0");
  }
  // the coefficients of our spline
  const betas: number[] = await solveForBetas(data, lambda);

  // the function that can generate a spline's y
  // from a given x.
  const splineFn = (x: number): number => {
    const basis: number[] = createBasisArray(x, data);
    // dot product betasArray and basisArray
    return betas.reduce((acc, beta, i) => (acc += beta * basis[i]), 0);
  };

  return splineFn;
}

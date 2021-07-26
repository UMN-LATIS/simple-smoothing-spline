import { Point, SplineFunction } from "../types";
import { createBasisCol } from "./createBasis";
import solveForBetas from "./solveForBeta";

class InvalidLambdaError extends Error {}

export default function generateSmoothingSplineFunction(
  data: Point[],
  { lambda }: { lambda: number }
): SplineFunction {
  if (lambda <= 0) {
    throw new InvalidLambdaError("lambda must be greater than 0");
  }
  // the coefficients of our spline
  const betas = solveForBetas(data, lambda);

  // the function that can generate a spline's y
  // from a given x.
  // y = β_0 + β_1*x + β_2*x^2 + β_3*x^3
  //     + β_4*pos((x - x_0)^3)
  //     + β_5*pos((x - x_1)^3)
  //     + ...
  //     + β_{n-1}*pos(x_{n-1} - x_{n-1})^3
  //
  // Or in matrix form:
  // f(x) = βvector * transpose([1 x x^2 x^3 ...])
  const splineFn = (x: number): number => {
    // there is probably a better way to do this without typescript complaining
    return betas.multiply(createBasisCol(x, data)).get(0, 0);
  };

  return splineFn;
}

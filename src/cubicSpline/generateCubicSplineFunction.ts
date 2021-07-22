import { matrix, transpose, inv, multiply } from "mathjs";
import getAllXs from "../helpers/getAllXs";
import getAllYs from "../helpers/getAllYs";
import { Point, SplineFunction } from "../types";

/**
 * Finds the coeffs of a cubic function that best fits the given data points
 * b0 + b1*x0 + b2*x0^2 + b3*x0^3 = y0
 * b0 + b1*x1 + b2*x1^2 + b3*x1^3 = y1
 * ...
 * b0 + b1*x{n-1} + b2*x{n-1}^2 + b3*x{n-1}^3 = y{n-1}
 *
 * such that we minimizes the sum of the squared distances
 *
 * betas = (X'*X)^-1 * X' * y
 *
 * Where X is a the basis matrix
 *  [[1, x0, x0^2, x0^3 ]
 *   [1, x1, x1^2, x1^3]
 *   ...
 *   [1, x{n-1}, x{n-1}^2, x{n-1}^3]]
 *
 * X' is the transpose of X
 * and y is the vector of y values
 *
 * See: https://en.wikipedia.org/wiki/Polynomial_regression
 */

export default (data: Point[]): SplineFunction => {
  const xs = getAllXs(data);
  const ys = getAllYs(data);

  const basisMatrix = matrix(xs.map((x) => [1, x, x ** 2, x ** 3]));
  const transposedBasisMatrix = transpose(basisMatrix);
  const Ycol = transpose(matrix(ys));
  const inverseXtX = inv(multiply(transposedBasisMatrix, basisMatrix));
  const betas = multiply(multiply(inverseXtX, transposedBasisMatrix), Ycol);

  // spline function is b0 + b1*x + b2*x^2 + b3*x^3
  return (x: number): number => {
    return multiply(betas, [1, x, x ** 2, x ** 3]) as unknown as number;
  };
};

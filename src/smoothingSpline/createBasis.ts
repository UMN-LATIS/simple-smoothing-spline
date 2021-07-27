import { Point } from "../types";
import getAllXs from "../helpers/getAllXs";
import pos from "../helpers/pos";
import Matrix from "../matrix/index";

export const createBasisArray = (x: number, data: Point[]): number[] => [
  1,
  x,
  x ** 2,
  x ** 3,
  ...getAllXs(data).map((x_k) => pos(x - x_k) ** 3),
];

// const createBasisRow = (x: number, data: Point[]) =>
//   matrix(createBasisArray(x, data));

/**
 * creates a column vector of the spline
 * basis function, transpose([1 x x^2 x^3 ...])
 * To be used to beta coefficients to generate
 * the full spline
 */
export const createBasisCol = (x: number, data: Point[]): Matrix =>
  new Matrix([createBasisArray(x, data)]).transpose();

/**
 * creates a matrix, X, of basis functions
 * using x values from our data set.
 * We'll need this when solving for betas.
 */
export const createBasisMatrix = (data: Point[]): Matrix => {
  const X = getAllXs(data).map((x) => createBasisArray(x, data));
  return new Matrix(X);
};

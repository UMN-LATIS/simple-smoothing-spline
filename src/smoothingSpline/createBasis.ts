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

/**
 * creates a column vector of the spline
 * basis function, transpose([1 x x^2 x^3 ...])
 * To be used to beta coefficients to generate
 * the full spline
 */
export const createBasisCol = (x: number, data: Point[]): Promise<Matrix> =>
  new Promise((resolve) => {
    const M = new Matrix([createBasisArray(x, data)]).transpose();
    resolve(M);
  });

/**
 * creates a matrix, X, of basis functions
 * using x values from our data set.
 * We'll need this when solving for betas.
 */
export const createBasisMatrix = async (data: Point[]): Promise<Matrix> => {
  const X = await Promise.all([
    ...getAllXs(data).map((x) => createBasisArray(x, data)),
  ]);
  return new Matrix(X);
};

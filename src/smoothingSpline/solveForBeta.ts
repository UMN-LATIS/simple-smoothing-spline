// import {
//   transpose,
//   matrix,
//   add,
//   multiply,
//   inv,
//   Matrix,
//   identity,
// } from "mathjs";

import Matrix from "../matrix/matrix";
import { createBasisMatrix } from "./createBasis";
import getAllYs from "../helpers/getAllYs";
import { Point } from "../types";

/**
 * Uses Ridge regression to solve the linear system:
 *    X*β = y
 * where:
 *  X is the matrix of basis functions made from the
 *    x values of the given data set
 *  β is the coefficients to our smoothing
 *    spline function
 *  y is the column vector of y values from the given
 *    data set
 *
 * The solution for β̂ can be found with:
 *  β̂ = inverseMatrix(transpose(X) * X + λ*I)
 *       * transpose(X) * y
 *
 * See: https://online.stat.psu.edu/stat857/node/155/
 */
export default function solveForBetas(data: Point[], lambda: number) {
  const X = createBasisMatrix(data);
  const y = new Matrix([getAllYs(data)]).transpose();
  const Xtrans = X.transpose();

  // λ*I
  const λI = Matrix.identity(X.cols).multiplyScalar(lambda);

  // transpose(M) * M + λ*I
  const inner = Xtrans.multiply(X).add(λI) as Matrix;

  // const invInner = inner.inverse();

  const betas = inner.inverse().multiply(Xtrans).multiply(y);
  return betas;
}

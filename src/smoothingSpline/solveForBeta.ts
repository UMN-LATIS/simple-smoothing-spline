import Matrix from "../matrix/index";
import { createBasisMatrix } from "./createBasis";
import getAllYs from "../helpers/getAllYs";
import { Point } from "../types";

/**
 * smoothingSpline uses Ridge regression to find the smoothing spline
 * that balance the fit of the data with smoothness of the curve
 *
 * The solution for β̂ can be found with:
 *  β̂ = (transpose(X) * X + λ*I)^-1
 *       * transpose(X) * y
 *
 * See: https://online.stat.psu.edu/stat857/node/155/
 */

/**
 * Naive approach to using Ridge Regression
 * Can be pretty unstable, but also can be fast.
 */

export async function solveForBetasNaive(
  data: Point[],
  lambda: number
): Promise<number[]> {
  const X = await createBasisMatrix(data);
  const yRow = new Matrix([getAllYs(data)]);
  const [y, Xtrans, λI] = await Promise.all([
    yRow.transpose(),
    X.transpose(),
    Matrix.identity(X.cols, lambda),
  ]);

  // transpose(M) * M + λ*I
  const XtX = await Xtrans.multiply(X);
  const inner = await XtX.add(λI);
  const [innerInv, XtY] = await Promise.all([
    inner.inverse(),
    Xtrans.multiply(y),
  ]);
  const betas = await innerInv.multiply(XtY);

  // clean up memory
  Matrix._flushMemory();

  return betas.toArray().flat();
}
// betas = V(S^2 + λI)^-1 * S * U' * y
// see: https://www.cs.ubc.ca/~murphyk/Teaching/CS540-Fall08/L5.pdf
export async function solveForBetasWithSVD(data: Point[], lambda: number) {
  // If X = U*S*V^T, the singular value decomposition of the X matrix
  // and y = the vector of y values for given x's
  // and U' is the transpose of U, then we can calcuate betas as:
  //     betas = V * (S^2 + λI)^{−1} S*U'*y

  const X = await createBasisMatrix(data);
  const y = await new Matrix([getAllYs(data)]).transpose();

  // calculate the SVD decomposition of X
  const { U, sigmaVector, V } = await X.toSVD();

  // (S^2 + λI)^{-1}
  // S^2 and λI are both diagonal matrices, so we just add the vectors
  // together. Additionally, inverse of a diagonal matrix is just the
  // reciprocal of the diagonal.
  // In the case where (S^2 + λI) === 0, we can't invert, so we just
  // set the inverse to 0.
  const innerInverse = sigmaVector.map((s) => {
    const s2pluslambda = s * s + lambda;
    return s2pluslambda === 0 ? 0 : 1 / s2pluslambda;
  });

  // now turns this vector into a matrix
  const [innerInv, Utrans, S] = await Promise.all([
    Matrix.diagonal(innerInverse),
    U.transpose(),
    Matrix.diagonal(sigmaVector),
  ]);

  // betas = V * (S^2 + λI)^{−1} S*U'*y
  //       = V * inner * U' * y
  const betas = await V.multiply(innerInv)
    .then((res) => res.multiply(S))
    .then((res) => res.multiply(Utrans))
    .then((res) => res.multiply(y));

  // clean up memory
  Matrix._flushMemory();
  return betas.toArray().flat();
}

export default solveForBetasWithSVD;

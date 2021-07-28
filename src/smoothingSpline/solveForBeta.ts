import Matrix from "../matrix/index";
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
 *  β̂ = (transpose(X) * X + λ*I)^-1
 *       * transpose(X) * y
 *
 * See: https://online.stat.psu.edu/stat857/node/155/
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
  return betas.toArray().flat();
}

// betas = V(S^2 + λI)^-1 * S * U' * y
// see: https://www.cs.ubc.ca/~murphyk/Teaching/CS540-Fall08/L5.pdf
// export function solveForBetasWithSVD(data: Point[], lambda: number) {
//   const X = createBasisMatrix(data);
//   const y = new Matrix([getAllYs(data)]).transpose();
//   const { U, S, V } = createBasisMatrix(data).toSVD();
//   // const Xtrans = X.transpose();

//   // λ*I
//   const λI = Matrix.identity(S.cols, lambda);

//   // S^2 + λI)^-1
//   const inner = S.multiply(S).add(λI).inverse();

//   // S * U' * y where U' is the transpose of U
//   const SUty = S.multiply(U.transpose().multiply(y));

//   // All together V(S^2 + λI)^-1 * S * U' * y
//   const betas = V.multiply(inner.multiply(SUty));
//   return betas;
// }

export default solveForBetasNaive;

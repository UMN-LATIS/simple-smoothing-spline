import Matrix from "../matrix/index.js";
import {createBasisMatrix} from "./createBasis.js";
import getAllYs from "../helpers/getAllYs.js";
export async function solveForBetasNaive(data, lambda) {
  const X = await createBasisMatrix(data);
  const yRow = new Matrix([getAllYs(data)]);
  const [y, Xtrans, λI] = await Promise.all([
    yRow.transpose(),
    X.transpose(),
    Matrix.identity(X.cols, lambda)
  ]);
  const XtX = await Xtrans.multiply(X);
  const inner = await XtX.add(λI);
  const [innerInv, XtY] = await Promise.all([
    inner.inverse(),
    Xtrans.multiply(y)
  ]);
  const betas = await innerInv.multiply(XtY);
  console.log(JSON.stringify({
    X,
    y,
    Xtrans,
    λI,
    XtX,
    inner,
    innerInv,
    XtY,
    betas
  }, null, 2));
  Matrix._flushMemory();
  return betas.toArray().flat();
}
export async function solveForBetasWithSVD(data, lambda) {
  const X = await createBasisMatrix(data);
  const y = await new Matrix([getAllYs(data)]).transpose();
  const {U, sigmaVector, V} = await X.toSVD();
  const innerInverse = sigmaVector.map((s) => {
    const s2pluslambda = s * s + lambda;
    return s2pluslambda === 0 ? 0 : 1 / s2pluslambda;
  });
  const [innerInv, Utrans, S] = await Promise.all([
    Matrix.diagonal(innerInverse),
    U.transpose(),
    Matrix.diagonal(sigmaVector)
  ]);
  const betas = await V.multiply(innerInv).then((res) => res.multiply(S)).then((res) => res.multiply(Utrans)).then((res) => res.multiply(y));
  Matrix._flushMemory();
  return betas.toArray().flat();
}
export default solveForBetasWithSVD;

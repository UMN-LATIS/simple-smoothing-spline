import {
  transpose,
  matrix,
  add,
  multiply,
  inv,
  identity
} from "../../_snowpack/pkg/mathjs.js";
import {createBasisMatrix} from "./createBasis.js";
import getAllYs from "../helpers/getAllYs.js";
export default function solveForBetas(data, lambda) {
  const X = createBasisMatrix(data);
  const y = transpose(matrix(getAllYs(data)));
  const Xtrans = transpose(X);
  const numOfColsOfX = X.size()[1];
  const λI = multiply(lambda, identity(numOfColsOfX));
  const inner = add(multiply(Xtrans, X), λI);
  const invInner = inv(inner);
  const betas = multiply(multiply(invInner, Xtrans), y);
  return betas;
}

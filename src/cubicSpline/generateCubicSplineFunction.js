import {matrix, transpose, inv, multiply} from "../../_snowpack/pkg/mathjs.js";
import getAllXs from "../helpers/getAllXs.js";
import getAllYs from "../helpers/getAllYs.js";
export default (data) => {
  const xs = getAllXs(data);
  const ys = getAllYs(data);
  const basisMatrix = matrix(xs.map((x) => [1, x, x ** 2, x ** 3]));
  const transposedBasisMatrix = transpose(basisMatrix);
  const Ycol = transpose(matrix(ys));
  const inverseXtX = inv(multiply(transposedBasisMatrix, basisMatrix));
  const betas = multiply(multiply(inverseXtX, transposedBasisMatrix), Ycol);
  return (x) => {
    return multiply(betas, [1, x, x ** 2, x ** 3]);
  };
};

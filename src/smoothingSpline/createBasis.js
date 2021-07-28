import getAllXs from "../helpers/getAllXs.js";
import pos from "../helpers/pos.js";
import {matrix, transpose} from "../../_snowpack/pkg/mathjs.js";
const createBasisArray = (x, data) => [
  1,
  x,
  x ** 2,
  x ** 3,
  ...getAllXs(data).map((x_k) => pos(x - x_k) ** 3)
];
export const createBasisCol = (x, data) => transpose(matrix(createBasisArray(x, data)));
export const createBasisMatrix = (data) => {
  const X = getAllXs(data).map((x) => createBasisArray(x, data));
  return matrix(X);
};

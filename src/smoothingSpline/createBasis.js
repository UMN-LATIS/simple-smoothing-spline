import getAllXs from "../helpers/getAllXs.js";
import pos from "../helpers/pos.js";
import Matrix from "../matrix/index.js";
export const createBasisArray = (x, data) => [
  1,
  x,
  x ** 2,
  x ** 3,
  ...getAllXs(data).map((x_k) => pos(x - x_k) ** 3)
];
export const createBasisCol = (x, data) => new Promise((resolve) => {
  const M = new Matrix([createBasisArray(x, data)]).transpose();
  resolve(M);
});
export const createBasisMatrix = async (data) => {
  const X = await Promise.all([
    ...getAllXs(data).map((x) => createBasisArray(x, data))
  ]);
  return new Matrix(X);
};

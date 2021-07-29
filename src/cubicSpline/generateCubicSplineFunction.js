import Matrix from "../matrix/index.js";
import getAllXs from "../helpers/getAllXs.js";
import getAllYs from "../helpers/getAllYs.js";
export default async (data) => {
  const xs = getAllXs(data);
  const ys = getAllYs(data);
  const basisMatrix = new Matrix(xs.map((x) => [1, x, x ** 2, x ** 3]));
  const transposedBasisMatrix = await basisMatrix.transpose();
  const Y = await new Matrix([ys]).transpose();
  const betas = await transposedBasisMatrix.multiply(basisMatrix).then((M) => M.inverse()).then((M) => M.multiply(transposedBasisMatrix)).then((M) => M.multiply(Y)).then((M) => M.toArray().flat());
  return (x) => {
    const basis = [1, x, x ** 2, x ** 3];
    return betas.reduce((acc, beta, i) => acc + beta * basis[i], 0);
  };
};

import {createBasisArray} from "./createBasis.js";
import solveForBetas from "./solveForBeta.js";
class InvalidLambdaError extends Error {
}
export default async function generateSmoothingSplineFunction(data, {lambda}) {
  if (lambda <= 0) {
    throw new InvalidLambdaError("lambda must be greater than 0");
  }
  const betas = await solveForBetas(data, lambda);
  const splineFn = (x) => {
    const basis = createBasisArray(x, data);
    return betas.reduce((acc, beta, i) => acc += beta * basis[i], 0);
  };
  return splineFn;
}

import {multiply} from "../../_snowpack/pkg/mathjs.js";
import {createBasisCol} from "./createBasis.js";
import solveForBetas from "./solveForBeta.js";
class InvalidLambdaError extends Error {
}
export default function generateSmoothingSplineFunction(data, {lambda}) {
  if (lambda <= 0) {
    throw new InvalidLambdaError("lambda must be greater than 0");
  }
  const betas = solveForBetas(data, lambda);
  const splineFn = (x) => {
    return multiply(betas, createBasisCol(x, data));
  };
  return splineFn;
}

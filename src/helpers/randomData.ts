import { Point } from "../types";

const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min + 1) + min;

const coeffs = [randomFloat(-10, 10), randomFloat(-10, 10)];

const trueFunction = (x: number): number =>
  coeffs[0] + coeffs[1] * Math.sin(x / 100);

const withError = (x: number): number => {
  const epsilon = Math.log(Math.abs(trueFunction(x)));
  return x + epsilon * (Math.random() - 0.5);
};

export const getPoints = (n: number): Point[] =>
  [...Array(n).keys()].map((x) => ({
    x,
    y: trueFunction(withError(x)),
  }));

// actual function without noise. Useful for testing.
export default {
  getPoints,
  trueFunction,
};

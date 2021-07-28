import { Point } from "../types";

const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min + 1) + min;

const coeffs = [randomFloat(-10, 10), randomFloat(-10, 10)];

const trueFunction = (
  x: number,
  precision = Number.POSITIVE_INFINITY
): number => {
  const y = coeffs[0] + coeffs[1] * Math.sin(x / 100);
  const epsilon = Math.pow(10, -1 * precision);

  return precision < 32 ? y + epsilon * (Math.random() - 0.5) : y;
};

export const getPoints = (n: number, precision: number = 2): Point[] =>
  [...Array(n).keys()].map((x) => ({
    x,
    y: trueFunction(x, precision),
  }));

// actual function without noise. Useful for testing.
export default {
  getPoints,
  trueFunction,
};

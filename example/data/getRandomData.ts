import { Point } from "../../src/types";

const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min + 1) + min;

const getRandomData = (n: number): Point[] => {
  // random coeffs
  const coeffs = [randomFloat(-10, 10), randomFloat(-10, 10)];

  const withError = (x: number): number => {
    const epsilon = Math.max(0.0001, 20 * Math.log(x));
    return x + epsilon * (Math.random() - 0.5);
  };

  return [...Array(n).keys()].map((x) => ({
    x,
    y: coeffs[0] + coeffs[1] * Math.sin(withError(x) / 100),
  }));
};

export default getRandomData;

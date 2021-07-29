const randomFloat = (min, max) => Math.random() * (max - min + 1) + min;
const coeffs = [randomFloat(-10, 10), randomFloat(-10, 10)];
const trueFunction = (x, precision = Number.POSITIVE_INFINITY) => {
  const y = coeffs[0] + coeffs[1] * Math.sin(x / 100) + Math.cos(x);
  const epsilon = Math.pow(10, -1 * precision);
  return precision < 32 ? y + epsilon * (Math.random() - 0.5) : y;
};
export const getPoints = (n, precision = 2) => [...Array(n).keys()].map((i) => ({
  x: i - n / 2,
  y: trueFunction(i - n / 2, precision)
}));
export default {
  getPoints,
  trueFunction
};

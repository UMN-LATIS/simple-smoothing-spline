import { matrix, transpose, identity, multiply, add, inv } from "mathjs";
import { pipe } from "ramda";

// Positive or 0. Needed in basis functions
const pos = (val) => Math.max(val, 0);

// given collection of {x, y} points, get all x values
const getAllXs = (pts) => pts.map((pt) => pt.x);

// given collection of {x, y} points, get all y values
const getAllYs = (pts) => pts.map((pt) => pt.y);

/**
 * creates a matrix, X, of basis functions
 * using x values from our data set.
 * We'll need this when solving for betas.
 */
function createBasisMatrix(data) {
  const X = [];

  for (let i = 0; i < data.length; i++) {
    const { x } = data[i];
    const row = [
      1,
      x,
      x ** 2,
      x ** 3,
      ...getAllXs(data).map((x_k) => pos(x - x_k) ** 3),
    ];
    X.push(row);
  }

  return matrix(X);
}

/**
 * wrapper for matrix multiply that can handle
 * more than 2 arguments
 */
function mult(firstMatrix, ...matrices) {
  return matrices.reduce(
    (runningProduct, matrix) => multiply(runningProduct, matrix),
    firstMatrix
  );
}

/**
 * Uses Ridge regression to solve the linear system:
 *    X*β = y
 * where:
 *  X is the matrix of basis functions made from the
 *    x values of the given data set
 *  β is the coefficients to our smoothing
 *    spline function
 *  y is the column vector of y values from the given
 *    data set
 *
 * The solution for β̂ can be found with:
 *  β̂ = inverseMatrix(transpose(X) * X + λ*I)
 *       * transpose(X) * y
 *
 * See: https://online.stat.psu.edu/stat857/node/155/
 */
function solveForBetas(data, lambda) {
  const X = createBasisMatrix(data);
  const y = transpose(matrix(getAllYs(data)));
  const Xtrans = transpose(X);
  const numOfColsOfX = X.size()[1];

  // transpose(M) * M + λ*I
  const inner = add(
    multiply(Xtrans, X),
    multiply(lambda, identity(numOfColsOfX))
  );

  const betas = mult(inv(inner), Xtrans, y);
  return betas;
}

/**
 * creates a column vector of the spline
 * basis function, transpose([1 x x^2 x^3 ...])
 * To be used to beta coefficients to generate
 * the full spline
 */
function createBasisColVector(x, allXs) {
  return transpose(
    matrix([1, x, x ** 2, x ** 3, ...allXs.map((x_k) => pos(x - x_k) ** 3)])
  );
}

function generateSplinePoints(spline, data) {
  const splinePoints = [];

  const minX = Math.min(...getAllXs(data));
  const maxX = Math.max(...getAllXs(data));
  const stepSize = (maxX - minX) / 1000;

  for (let i = minX; i <= maxX; i += stepSize) {
    splinePoints.push({ x: i, y: spline(i) });
  }
  return splinePoints;
}

export default function smoothingSpline(data, lambda) {
  // the coefficients of our spline
  const betas = solveForBetas(data, lambda);

  // the function that can generate a spline's y
  // from a given x.
  // y = β_0 + β_1*x + β_2*x^2 + β_3*x^3
  //     + β_4*pos((x - x_0)^3)
  //     + β_5*pos((x - x_1)^3)
  //     + ...
  //     + β_{n-1}*pos(x_{n-1} - x_{n-1})^3
  //
  // Or in matrix form:
  // f(x) = βvector * transpose([1 x x^2 x^3 ...])
  const splineFn = (x) =>
    multiply(
      betas, // row
      createBasisColVector(x, getAllXs(data))
    );

  const splinePoints = generateSplinePoints(splineFn, data);

  return {
    spline: splineFn,
    points: splinePoints,
  };
}

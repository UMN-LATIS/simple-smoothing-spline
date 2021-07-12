# Smoothing Spline

> Fit a smoothing spline to collection of data points

## Usage

```js
const data = [
  { x: 1, y: 0.5 },
  { x: 2, y: 3 },
  { x: 3, y: 8.5 },
  { x: 4, y: 20 },
  { x: 1, y: 1 },
  { x: 2, y: 5 },
  { x: 3, y: 11 },
  { x: 4, y: 15 },
];

const spline = new SmoothingSpline(data, { lambda: 1 });
const splinePoints = spline.getPoints();
// gets points {x, y} that can be plotted

spline.setLambda(0.5).getPoints();
// sets Lambda to a new value and recalculates the spline points
```

## Installation

```console
$ npm install simple-smoothing-Spline
```

## Details

## License

---

## Notes

This is an experiment with generating regression functions for a random set of data. Ultmately, hopefully, leading to some javascript for creating cubic spline regressions.

### Approach

Here's an overview of our approach to getting a smoothing spline:

1. Set up system of linear equations. We are looking for a linear combination of set of cubic basis functions:

{ 1, x, x^2, x^3, (x - x_0)^3, (x - x_1)^3, ... (x - x_n-1)^3 }

where x_0 is a given x value in our data set (each x_i will be a knot in our spline).

such that:

β*0 * 1 + β*1 * x + β*2 * x^2 + β*3 * x^3 + β*4 * (x - x*0)^3 + ... + β_n+3 * (x - x_n-1) = y

So, given a collection of n data points (x, y) from (x_0, y_0) to (x_n-1, y_n-1), we can write a system of equations:

β*0 * 1 + β*1 * x*0 + β_2 * x*0^2 + β_3 * x*0^3 + β_4 * (x*0 - x_0)^3 + ... + β_n+3 * (x*0 - x_n-1) = y_0
β_0 * 1 + β*1 * x*1 + β_2 * x*1^2 + β_3 * x*1^3 + β_4 * (x*1 - x_0)^3 + ... + β_n+3 * (x*1 - x_n-1) = y_1
⋮
β_0 * 1 + β*1 * x*n-1 + β_2 * x*n-1^2 + β_3 * x*n-1^3 + β_4 * (x*n-1 - x_0)^3 + ... + β_n+3 * (x_n-1 - x_n-1) = y_n-1

Or in matrix form: Xmatrix \* βVector = yVector

Where Xmatrix is:

```math
Xmatrix = [
  [ 1, x_0, x_0^2, x_0^3, (x_0 - x_0)^3, (x_0 - x_1)^3, ..., (x_0 - x_n-1)^3],
  [ 1, x_1, x_1^2, x_1^3, (x_1 - x_0)^3, (x_1 - x_1)^3, ..., (x_1 - x_n-1)^3],
  ⋮
  [ 1, x_n-1, x_n-1^2, x_n-1^3, (x_n-1 - x_0)^3, (x_n-1 - x_1)^3, ..., (x_n-1 - x_n-1)^3],
]
```

And βVector is the parameters of our Spline: `[ β_0, β_1, β_2, ..., β_n+3]`
And yVector is the y values from the data: `[y_0, y_1, y_2, ... y_n-1]`

### Part 2: Ridge Regression to Solve for βVector

Solve for `β̂`

$$
β̂ = inverseMatrix(transposed(X) * X + λ*I) * transposed(X) * y`
$$

Where I is the identity matrix and λ is a new input variable that we are introducing into the model. λ is controlled by a hyperparameter, α , that controls how strongly we penalize overfitting.

```
const spline = new SmoothingSpline(matrixX, vectorY, lambda);
spline.coefficients => gives values of beta
spline.toString => prints f(x) = beta0 + beta1*x + beta2*x^2 ...
spline.toPoints(xMin, xMax, stepSize) => collection of points {x, y} from xMin to xMax
spline.getLambda()
spline.setLambda(3)
spline.getDegreesOfFreedom
```

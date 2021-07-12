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

const spline = new SmoothingSpline(data, { lambda: 1000 });
const splinePoints = spline.getPoints();
//

spline.setLambda(0.5).getPoints();
// sets Lambda to a new value and recalculates the spline points
```

## Installation

```console
$ npm install simple-smoothing-spline
```

## Details

## License

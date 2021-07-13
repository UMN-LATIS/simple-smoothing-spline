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

## Alt Usage

```js
import SmoothingSpline from "simple-smoothing-spline";

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

const splinePts = await spline.getPoints();
// list of {x, y} points from the smoothing spline

const updatedSplinePoints = await spline
  .addData([
    { x: 1, y: 1.5 },
    { x: 2, y: 5.3 },
    { x: 3, y: 20 },
    { x: 4, y: 13 },
  ])
  .setLamdba(2000)
  .getPoints();
```

## Installation

```console
$ npm install simple-smoothing-spline
```

## API

## License

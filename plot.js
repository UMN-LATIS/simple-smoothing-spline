import Plotly from "plotly.js-dist-min";
import SmoothingSpline from "./index.js";

// helper to convert a collection of points to a
// plotly trace
const dataToPlotlyTrace = (collectionOfPoints, { mode = "markers" }) =>
  collectionOfPoints.reduce(
    (acc, { x, y }) => ({
      ...acc,
      x: acc.x.concat(x),
      y: acc.y.concat(y),
    }),
    { x: [], y: [], mode, type: "scatter" }
  );

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
// const splinePoints = spline.getPoints();
// gets points {x, y} that can be plotted

// const splineWithSmallerLambda = spline.setLambda(0.5).getPoints();

// create plotly traces
const traces = [data].map(dataToPlotlyTrace);
traces.push(dataToPlotlyTrace(spline.getPoints(0, 5, 0.01), { mode: "line" }));
Plotly.newPlot("plot", traces);

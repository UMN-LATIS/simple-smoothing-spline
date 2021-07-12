import Plotly from "plotly.js-dist-min";
import SmoothingSpline from "./index.js";
import { CCS, SpR } from "./data.js";

const PLOT_NAME = "plot";

// helper to convert a collection of points to a
// plotly trace
const dataToPlotlyTrace = (
  collectionOfPoints,
  { name, mode = "markers" } = {}
) =>
  collectionOfPoints.reduce(
    (acc, { x, y }) => ({
      ...acc,
      x: acc.x.concat(x),
      y: acc.y.concat(y),
    }),
    { x: [], y: [], mode, type: "scatter", name }
  );

const getLambdaFromInput = () =>
  0.0001 * 2 ** Number.parseFloat(document.querySelector("#smoothness").value);
const spline = new SmoothingSpline([...CCS, ...SpR], {
  lambda: getLambdaFromInput(),
});

// create plotly traces
const traces = [
  dataToPlotlyTrace(CCS, { name: "CCS" }),
  dataToPlotlyTrace(SpR, { name: "SpR" }),
];

traces.push(
  dataToPlotlyTrace(spline.getPoints(), {
    mode: "line",
    name: "smoothing spline",
  })
);
Plotly.newPlot(PLOT_NAME, traces);

document.querySelector("#smoothness").addEventListener("change", () => {
  const lambda = getLambdaFromInput();
  document.getElementById("lambda-value").innerText = lambda;
  spline.setLambda(lambda);

  // remove the last trace
  Plotly.deleteTraces(PLOT_NAME, -1);
  Plotly.addTraces(
    PLOT_NAME,
    dataToPlotlyTrace(spline.getPoints(1930, 2018, 0.01), { mode: "line" })
  );
});

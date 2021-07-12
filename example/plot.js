import Plotly from "plotly.js-dist-min";
import SmoothingSpline from "../index.js";
import pointsToPlotlyTrace from "./pointsToPlotlyTrace.js";
import { CCS as CCSdata, SpR as SpRdata } from "./data.js";

// ID of our plotly plot.
const PLOT_ID = "plot";

// create plotly traces for the raw data
const traces = [
  pointsToPlotlyTrace(CCSdata, { name: "CCS" }),
  pointsToPlotlyTrace(SpRdata, { name: "SpR" }),
];

// Graph the raw data sets as scatter plots
Plotly.newPlot(PLOT_ID, traces);

// Set up our smoothing slider. This input will translate into lambda
// which is a tuning parameter to control how smooth a function is
const getLambdaFromInput = () =>
  0.0001 * 2 ** Number.parseFloat(document.querySelector("#smoothness").value);
const renderLambda = (lambda) =>
  (document.getElementById("lambda-value").innerText = lambda);
renderLambda(getLambdaFromInput());

// Now, let's create a smoothing spline from the data.

// 1. Aggregate all the data you want to smooth:
// Here we're combining two collections, CCSdata and SpRdata,
// into a single array called "data".
const data = [...CCSdata, ...SpRdata];

// 2. Create your smoothing spline. Provide a lambda option.
const spline = new SmoothingSpline(data, { lambda: getLambdaFromInput() });

// 3. get the points to plot and convert it to a plotly trace
// add it to our list of traces
const splinePoints = spline.getPoints();

const splineTrace = pointsToPlotlyTrace(splinePoints, {
  mode: "line",
  name: "Spline",
});

splineTrace.ids = splineTrace.x.map((val) => val.toString());

traces.push(splineTrace);

// 4. Plot the smoothing spline
// using Plotly.react for faster updates
Plotly.react(PLOT_ID, traces);

document.querySelector("#smoothness").addEventListener("change", () => {
  const lambda = getLambdaFromInput();

  // update the lambda on the spline, which will resolve the smoothing spline
  spline.setLambda(lambda);

  // show new lambda next to the slider
  renderLambda(lambda);

  // replace the last trace with the new one
  const updatedSplineTrace = pointsToPlotlyTrace(spline.getPoints(), {
    mode: "line",
    name: "Spline",
  });
  Plotly.animate(
    PLOT_ID,
    {
      data: [
        {
          x: updatedSplineTrace.x,
          y: updatedSplineTrace.y,
        },
      ],
      traces: [traces.length - 1],
    },
    {
      transition: {
        duration: 100,
        easing: "cubic-in-out",
      },
    }
  );
});

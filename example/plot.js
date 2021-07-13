import Plotly from "plotly.js-dist";

/**
 * Track previous renders so that we can use
 * Plotly's react method to update rather can replotting
 * completely new graphs.
 **/
const previousRenders = {};
const hasPreviouslyRendered = (plotId) => !!previousRenders[plotId];
const recordRender = (plotId) => (previousRenders[plotId] = true);

/**
 * renders a new plot if this is our first
 * or uses Plotly.react to update if we've have previously
 * rendered this plotId.
 */
function renderPlot(traces, plotId) {
  if (hasPreviouslyRendered(plotId)) {
    return Plotly.react(traces);
  }
  console.log({ Plotly });
  Plotly.newPlot(traces);
  recordRender(plotId);
}

/**
 * converts a collection of points {x, y}
 * to a plotlyJS trace
 */
function pointsToPlotlyTrace(
  collectionOfPoints,
  { type = "scatter", mode = "markers", ...plotlyOpts } = {}
) {
  return {
    x: collectionOfPoints.map((pt) => pt.x),
    y: collectionOfPoints.map((pt) => pt.y),
    type,
    mode,
    ...plotlyOpts,
  };
}

/**
 * given an dictionary of data sets, convert them
 * all to plotly traces
 * @param {Object.<string, Point[]>} dataSetDict
 */
function toTraces(dataSetDict) {
  return Object.keys(dataSetDict).map((key) =>
    pointsToPlotlyTrace(dataSetDict[key], { name: key })
  );
}

/**
 * plots a dictionary of data sets
 *
 * @param {Object.<string, Point[]>} dataSets - dictionary of datasets
 * The keyname will the name assigned to the trace.
 * @param {string} plotId - id of the html element to use for plotting
 */
export default function plot(dataSetDict, plotId = "plot") {
  const traces = toTraces(dataSetDict);
  renderPlot(traces, plotId);
}

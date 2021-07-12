/**
 * transforms a collection of points {x, y} into a plotly trace.
 *
 * @param {Point[]} collectionOfPoints - array of points {x, y}
 * @param {string} opts.name - name of the plotly plot
 * @param {string} [opts.mode="markers"] - plotly mode. Defaults to "markers".
 * @param {string} [opts.type="scatter"] - type of plot. Defaults to "scatter".
 **/
export default (
  collectionOfPoints,
  { type = "scatter", mode = "markers", ...plotlyOpts } = {}
) =>
  collectionOfPoints.reduce(
    (acc, { x, y }) => ({
      ...acc,
      x: acc.x.concat(x),
      y: acc.y.concat(y),
    }),
    { x: [], y: [], type, mode, ...plotlyOpts }
  );

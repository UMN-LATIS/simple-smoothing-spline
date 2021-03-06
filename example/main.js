// Comment this next line out if using simpleSmoothingSpline
// from a CDN. See the index.html file.
import simpleSmoothingSpline from "../src/index.ts";
import store from "./store/store.js";
import plot from "./helpers/plot.js";
import getAllData from "./helpers/getAllData.js";
import handleInputChange from "./helpers/handleInputChange.js";
import onReady from "./helpers/onReady.js";

const PLOT_ID = "plot";

// render function will run every time the state of the application changes
// that is, if the slider is adjusted or more data is added.
async function render(state) {
  // update lambda to match the state value
  document.querySelector("#lambda-value").textContent = state.lambda;

  // get points for the spline
  const data = getAllData(state);

  const smoothSpline = await simpleSmoothingSpline(data, {
    lambda: state.lambda,
  });

  const cubicSpline = await simpleSmoothingSpline(data, { type: "cubic" });

  // render plot with data and smoothing spline points
  plot(
    {
      ...state.data,
      "smooth spline": smoothSpline.points,
      "cubic spline": cubicSpline.points,
    },
    PLOT_ID
  );
}

// wait until the page is loaded, then...
onReady(() => {
  // This is what makes the render function run every time the state changes.
  store.subscribe(render);

  // listen for any changes to the slider on the page which controls
  // the lambda (smoothness) tuning variable
  document
    .querySelector("#smoothness")
    .addEventListener("change", handleInputChange);

  // get the initial state of the app (see the store.js) and render the screen
  render(store.getState());
});

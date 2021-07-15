/* global simpleSmoothingSpline */
import store from "./store/store.js";
import plot from "./helpers/plot.js";
import getAllData from "./helpers/getAllData.js";
import handleInputChange from "./helpers/handleInputChange.js";
import onReady from "./helpers/onReady.js";

const PLOT_ID = "plot";

// render function will run every time the state of the application changes
// that is, if the slider is adjusted or more data is added.
function render(state) {
  // update lambda to match the state value
  document.querySelector("#lambda-value").textContent = state.lambda;

  // get points for the spline
  const data = getAllData(state);
  const spline = simpleSmoothingSpline(data, { lambda: state.lambda });

  // render plot with data and smoothing spline points
  plot({ ...state.data, "smoothing spline": spline.points }, PLOT_ID);
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

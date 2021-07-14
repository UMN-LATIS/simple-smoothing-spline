import store from "./store/store.js";
import smoothingSpline from "../index.js";
import plot from "./helpers/plot.js";
import getAllData from "./helpers/getAllData.js";
import handleInputChange from "./helpers/handleInputChange.js";
import onReady from "./helpers/onReady.js";

const PLOT_ID = "plot";

function render(state) {
  // update lambda to match the state value
  document.querySelector("#lambda-value").textContent = state.lambda;

  // get points for the spline
  const data = getAllData(state);
  const spline = smoothingSpline(data, { lambda: state.lambda });

  // render plot with data and smoothing spline points
  plot({ ...state.data, "smoothing spline": spline.points }, PLOT_ID);
}

onReady(() => {
  store.subscribe(render);
  document
    .querySelector("#smoothness")
    .addEventListener("change", handleInputChange);

  render(store.getState());
});

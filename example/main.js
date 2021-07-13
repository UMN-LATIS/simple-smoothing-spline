import { createStore } from "./store.js";
import smoothingSpline from "../index.js";
import { CCS, SpR } from "./data.js";
import plot from "./plot.js";

let initialState = {
  data: {
    CCS,
    SpR,
  },
  lambda: 1000,
};

// Actions
const INPUT_CHANGE = "INPUT_CHANGE";

// process any chnages to our application
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_CHANGE:
      return { ...state, lambda: action.payload };
    default:
      return state;
  }
}

const store = createStore(rootReducer);

function getAllData(state) {
  return Object.keys(state.data).reduce(
    (acc, key) => [...acc, ...state.data[key]],
    []
  );
}

function handleInputChange(event) {
  const sliderValue = Number.parseInt(event.target.value);
  // scaling lambda based on slider
  const newLambda = 0.00001 * 2 ** sliderValue;
  store.dispatch({
    type: INPUT_CHANGE,
    payload: newLambda,
  });
}

function render(state) {
  const PLOT_ID = "plot";

  // update lambda
  document.querySelector("#lambda-value").textContent = state.lambda;

  // get points for the spline
  const data = getAllData(state);
  const spline = smoothingSpline(data, { lambda: state.lambda });

  plot({ ...state.data, "smoothing spline": spline.points }, PLOT_ID);
}

// wait for document ready
const onReady = (fn) =>
  document.readyState !== "loading"
    ? fn()
    : document.addEventListener("DOMContentLoaded", fn);

onReady(() => {
  store.subscribe(render);
  document
    .querySelector("#smoothness")
    .addEventListener("change", handleInputChange);

  render(store.getState());
});

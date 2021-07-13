import { createStore } from "./store.js";
import smoothingSpline from "../index.ts";
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
const CHANGE_LAMBDA = "CHANGE_LAMBDA";

// process any chnages to our application
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LAMBDA:
      return { ...state, lambda: action.payload };
    default:
      return state;
  }
}

const store = createStore(rootReducer);
console.log({ store });

function getAllData(state) {
  return Object.keys(state.data).reduce(
    (acc, key) => [...acc, ...state.data[key]],
    []
  );
}

function render(state) {
  const PLOT_ID = "plot";

  // get points for the spline
  const data = getAllData(state);
  const spline = smoothingSpline(data, state.lambda);

  plot({ ...state.data, spline }, PLOT_ID);
}

// wait for document ready
const onReady = (fn) =>
  document.readyState !== "loading"
    ? fn()
    : document.addEventListener("DOMContentLoaded", fn);

onReady(() => {
  store.subscribe(render);
  render(store.getState());
});

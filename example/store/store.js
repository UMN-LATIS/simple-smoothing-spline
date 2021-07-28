import { CCS, SpR } from "../data/data.js";
// import moarData from "../data/moarData.js";
// import simple from "../data/simple";
import { createStore } from "./createStore.js";

export const INPUT_CHANGE = "INPUT_CHANGE";

// this holds the initial state of our application
// we load in two data sets and set a default lambda
let initialState = {
  data: {
    CCS,
    SpR,
    // CCS2: CCS.map(({ x, y }) => ({ x: x + Math.sin(x), y: y + Math.cos(x) })),
    // moarData: moarData.splice(0, 1000),
    // simple,
  },
  lambda: 1,
};

// this function processes any actions from the UI
// updating the store's state. The store will run
// any listeners once it state changes.
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_CHANGE:
      return { ...state, lambda: action.payload };
    default:
      return state;
  }
}

// a redux-style store for holding our app data
const store = createStore(rootReducer);

export default store;

import { CCS, SpR } from "../data/data.js";
import simple from "../data/simple";
import { createStore } from "./createStore.js";

export const INPUT_CHANGE = "INPUT_CHANGE";

// this holds the initial state of our application
// we load in two data sets and set a default lambda
let initialState = {
  data: {
    // CCS,
    // SpR,
    simple,
  },
  lambda: 1000,
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

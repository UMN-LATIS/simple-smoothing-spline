import { CCS, SpR } from "../data/data.js";
import { createStore } from "./createStore.js";

export const INPUT_CHANGE = "INPUT_CHANGE";

let initialState = {
  data: {
    CCS,
    SpR,
  },
  lambda: 1000,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_CHANGE:
      return { ...state, lambda: action.payload };
    default:
      return state;
  }
}

// a redux-style store for holding the data
const store = createStore(rootReducer);

export default store;

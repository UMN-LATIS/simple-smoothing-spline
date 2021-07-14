import store, { INPUT_CHANGE } from "../store/store.js";

export default function handleInputChange(event) {
  const sliderValue = Number.parseInt(event.target.value);
  // scaling lambda based on slider
  const newLambda = 0.00001 * 2 ** sliderValue;
  store.dispatch({
    type: INPUT_CHANGE,
    payload: newLambda,
  });
}

// gets all data from the current state
export default function getAllData(state) {
  return Object.keys(state.data).reduce(
    (acc, key) => [...acc, ...state.data[key]],
    []
  );
}

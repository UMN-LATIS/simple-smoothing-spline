import * as marky from "../../_snowpack/pkg/marky.js";
const timeit = (name) => {
  timeit.start(name);
  return (timedThingy) => {
    timeit.stop(name);
    return timedThingy;
  };
};
timeit.start = (name) => marky.mark(name);
timeit.stop = (name, {log = false} = {}) => {
  const time = marky.stop(name);
  if (log) {
    console.log(`👉⏱ ${name} ${time.duration.toFixed(4)}ms`);
  }
  return time.duration;
};
export default timeit;

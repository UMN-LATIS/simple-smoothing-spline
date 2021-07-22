import * as marky from "marky";

const timeit = (name: string) => {
  timeit.start(name);
  return (timedThingy: any) => {
    timeit.stop(name);
    return timedThingy;
  };
};

timeit.start = (name: string) => marky.mark(name);
timeit.stop = (name: string) => {
  const time = marky.stop(name);
  console.log(`👉⏱ ${name} ${time.duration.toFixed(4)}ms`);
};

export default timeit;

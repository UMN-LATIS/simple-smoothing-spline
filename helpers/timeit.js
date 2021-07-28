import * as marky from "marky";
const timeit = (name) => {
    timeit.start(name);
    return (timedThingy) => {
        timeit.stop(name);
        return timedThingy;
    };
};
timeit.start = (name) => marky.mark(name);
timeit.stop = (name) => {
    const time = marky.stop(name);
    console.log(`👉⏱ ${name} ${time.duration.toFixed(4)}ms`);
};
export default timeit;
//# sourceMappingURL=timeit.js.map
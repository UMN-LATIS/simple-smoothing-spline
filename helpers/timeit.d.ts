declare const timeit: {
    (name: string): (timedThingy: any) => any;
    start(name: string): void;
    stop(name: string): void;
};
export default timeit;

import { expect } from "@jest/globals";
import smoothingSpline from "./index";
import timeit from "./helpers/timeit";
import range from "./helpers/range";
import randomData from "./helpers/randomData";

const dataWithSomeNoise = randomData.getPoints(100);
const trueFunction = randomData.trueFunction;

describe("simple-smoothing-spline", () => {
  it("creates spline points with given data", async () => {
    const { points } = await smoothingSpline(dataWithSomeNoise, {
      lambda: 0.0001,
    });
    expect(points.length).toBe(1000);
    // expect our points are close to the real ones
    // with a small lambda

    points.forEach(({ x, y }) => {
      const eps = Math.log(Math.abs(trueFunction(x)));
      expect(y).toBeCloseTo(trueFunction(x), 0.01);
    });
  });

  it("makes a spline function that gives a y for a given x", async () => {
    const spline = await smoothingSpline(dataWithSomeNoise);
    spline.points.forEach(({ x, y }) => expect(spline.fn(x)).toBe(y));
  });

  it("takes an optional lambda parameter", async () => {
    const spline = await smoothingSpline(dataWithSomeNoise, { lambda: 1 });
    expect(spline.fn(2)).toBeCloseTo(trueFunction(2), 0.001);
    expect(spline.fn(3)).toBeCloseTo(trueFunction(3), 0.001);
  });

  it("throws an error unless lambda is positive", async () => {
    const testFn = async () =>
      await smoothingSpline(dataWithSomeNoise, { lambda: 0 });
    await expect(testFn).rejects.toThrowError("lambda must be greater than 0");
  });

  it("should not always go through the origin", async () => {
    const data = [
      { x: -2, y: 11 },
      { x: -1, y: 10 },
      { x: 0, y: 9 },
      { x: 1, y: 8 },
      { x: 2, y: 7 },
      { x: 3, y: 6 },
      { x: 4, y: 5 },
      { x: 5, y: 4 },
      { x: 6, y: 3 },
      { x: 7, y: 2 },
      { x: 8, y: 1 },
      { x: 9, y: 0 },
      { x: 10, y: -1 },
      { x: 11, y: -2 },
      { x: 12, y: -3 },
    ];
    const spline = await smoothingSpline(data, { lambda: 0.01 });
    expect(spline.fn(0)).toBeCloseTo(9, 0.001);
  });

  it.skip("should be performant", async () => {
    // target right now is for 600ms for n=500.
    // and for it to scale O(n^3)
    // So, expected time/n = 600/(500^3) = 0.0000048 ms/pt
    const expectedMSperPoint = 600 / 500 ** 3;
    const dataSet = range(0, 500).map((x) => ({
      x,
      y: Math.sin(x) + 0.1 * Math.random() - 0.5,
    }));

    timeit.start("smoothingSpline");
    await smoothingSpline(dataSet);
    const runtime = timeit.stop("smoothingSpline");

    // expect ~O(n^3) runtime?
    const expectedRuntime = expectedMSperPoint * dataSet.length ** 3;
    // console.log({ runtime, expectedRuntime });
    expect(runtime).toBeLessThan(expectedRuntime);
  });
});

// describe("natural spline", () => {
//   // to begin assume a cubic spline that's a best fit
//   // for the data set
//   it("fits a cubic spline with no knots", () => {
//     const spline = smoothingSpline(data, { type: "cubic" });
//     expect(spline.points).toMatchSnapshot();
//   });
// });

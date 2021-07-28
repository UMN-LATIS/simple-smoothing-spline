import { expect } from "@jest/globals";
import smoothingSpline from "./index";
import moarData from "./fixtures/moarData";
import timeit from "./helpers/timeit";
import { Point } from "./types";
import range from "./helpers/range";

const cubic = (x: number): number => 5 - 2 * x + 3 * x ** 2 - x ** 3;
const dataWithSomeNoise: Point[] = range(0, 10).map((x) => ({
  x,
  // using sin(x) for a little noise
  y: cubic(x) + 0.1 * Math.sin(x),
}));

describe("simple-smoothing-spline", () => {
  it("creates spline points with given data", async () => {
    const { points } = await smoothingSpline(dataWithSomeNoise, {
      lambda: 0.0001,
    });
    expect(points.length).toBe(1000);
    // expect our points are close to the real ones
    // with a small lambda
    points.forEach(({ x, y }) => {
      expect(y).toBeCloseTo(cubic(x), 0.1);
    });
  });

  it("makes a spline function that gives a y for a given x", async () => {
    const spline = await smoothingSpline(dataWithSomeNoise);
    spline.points.forEach(({ x, y }) => expect(spline.fn(x)).toBe(y));
  });

  it("takes an optional lambda parameter", async () => {
    const spline = await smoothingSpline(dataWithSomeNoise, { lambda: 1 });
    expect(spline.fn(2)).toBeCloseTo(4.82454, 0.001);
    expect(spline.fn(3)).toBeCloseTo(-0.960338, 0.001);
  });

  it("throws an error unless lambda is positive", async () => {
    const testFn = async () =>
      await smoothingSpline(dataWithSomeNoise, { lambda: 0 });
    await expect(testFn).rejects.toThrowError("lambda must be greater than 0");
  });

  it("should be performant", async () => {
    const expectedMSperPoint = 1;
    const dataSet = range(0, 500).map((x) => ({
      x,
      y: Math.sin(x) + 0.1 * Math.random() - 0.5,
    }));

    timeit.start("smoothingSpline");
    await smoothingSpline(dataSet);
    const runtime = timeit.stop("smoothingSpline");
    expect(runtime).toBeLessThan(expectedMSperPoint * dataSet.length);
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

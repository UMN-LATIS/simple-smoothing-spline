import { expect } from "@jest/globals";
import smoothingSpline from "./index";
import moarData from "./fixtures/moarData";

const data = [
  { x: 1, y: 0.5 },
  { x: 2, y: 3 },
  { x: 3, y: 8.5 },
  { x: 4, y: 20 },
  { x: 1, y: 1 },
  { x: 2, y: 5 },
  { x: 3, y: 11 },
  { x: 4, y: 15 },
];

describe("simple-smoothing-spline", () => {
  it("creates spline points with given data", () => {
    const spline = smoothingSpline(data);
    expect(spline.points).toMatchSnapshot();
  });

  it("makes a spline function that gives a y for a given x", () => {
    const spline = smoothingSpline(data);
    spline.points.forEach(({ x, y }) => expect(spline.fn(x)).toBe(y));
  });

  it("takes an optional lambda parameter", () => {
    const spline = smoothingSpline(data, { lambda: 1 });
    expect(spline.fn(2)).toMatchInlineSnapshot(`3.9309522146973404`);
    expect(spline.fn(3)).toMatchInlineSnapshot(`9.74752733088028`);
  });

  it("throws an error unless lambda is positive", () => {
    const testFn = () => smoothingSpline(data, { lambda: 0 });
    expect(testFn).toThrowError("lambda must be greater than 0");
  });

  it.skip("should be performant", () => {
    const expectedMSperPoint = 3;
    const dataSet = moarData.slice(0, 100);
    const start = Date.now();
    smoothingSpline(dataSet);
    const end = Date.now();
    const runtime = end - start;

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

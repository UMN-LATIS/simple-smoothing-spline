import { expect } from "@jest/globals";
import smoothingSpline from "../src/index";

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
    expect(spline.fn(2)).toMatchInlineSnapshot(`3.9286530789717804`);
    expect(spline.fn(3)).toMatchInlineSnapshot(`9.746784076269396`);
  });

  it("throws an error unless lambda is positive", () => {
    const testFn = () => smoothingSpline(data, { lambda: 0 });
    expect(testFn).toThrowError("lambda must be greater than 0");
  });
});

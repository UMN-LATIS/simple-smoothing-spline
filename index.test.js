import { expect } from "@jest/globals";
import "jest";
import SmoothingSpline from "./index";

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

const moarData = [
  { x: 1, y: 1.5 },
  { x: 2, y: 5.3 },
  { x: 3, y: 20 },
  { x: 4, y: 13 },
];

describe("simple-smoothing-spline", () => {
  it("creates a SmoothingSpline given a collection of points", () => {
    const spline = new SmoothingSpline(data);
    expect(spline).toBeInstanceOf(SmoothingSpline);
    expect(spline.data).toEqual(data);
  });

  it.todo("takes an optional lambda parameter");

  it.todo("throws an error if points are not in the expected format");

  describe("getAllXs", () => {
    it.todo("gets all x values from the data set");
  });

  describe("getAllYs", () => {
    it.todo("gets all y values from the data set");
  });

  describe("setLambda", () => {
    it.todo("changes the lambda value");
  });

  describe("getBasisMatrix", () => {
    it.todo("creates a basis matrix from the x data points");
  });

  describe("solveForBetas", () => {
    it.todo("uses Ridge Regression to solve for beta coeffs");
  });

  describe("getPoints", () => {
    it.todo("gets points for the smoothing spline");
    it.todo("gets points in the range minX and maxX");
    it.todo("gets updates points after lambda changes");
  });
});

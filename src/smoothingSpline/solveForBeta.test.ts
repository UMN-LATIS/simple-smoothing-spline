import { Point } from "../types";
import solveForBetas from "./solveForBeta";

describe("solveForBeta", () => {
  it("solves for coefficients of a smoothing spline", () => {
    const cubic = (x: number): number => 5 - 2 * x + 3 * x ** 2 - x ** 3;
    const dataWithSomeNoise: Point[] = [...Array(10).keys()].map((x) => ({
      x,
      y: cubic(x) + 0.1 * Math.random() - 0.05,
    }));
    const betas = solveForBetas(dataWithSomeNoise, 1000);

    expect(betas.rows).toBe(dataWithSomeNoise.length + 4);
    expect(betas.cols).toBe(1);
  });
});

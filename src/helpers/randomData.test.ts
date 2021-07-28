import randomData from "./randomData";

describe("randomData", () => {
  describe("trueFunction", () => {
    it("should create a true function", () => {
      expect(randomData.trueFunction).toBeDefined();
    });

    it("should give the same ys for xs on each run", () => {
      const xs = [...Array(10).keys()].map((i) => i * Math.random());
      const ys1 = xs.map((x) => randomData.trueFunction(x));
      const ys2 = xs.map((x) => randomData.trueFunction(x));
      expect(ys1).toEqual(ys2);
    });

    it("should never give a NaN", () => {
      expect(isNaN(randomData.trueFunction(0))).toBe(false);
      for (let i = 0; i < 1000; i++) {
        const x = 1000 * Math.random() - 500;
        expect(isNaN(randomData.trueFunction(x))).toBe(false);
      }
    });
  });

  describe("getPoints", () => {
    it("should get a list of n points", () => {
      const points = randomData.getPoints(10);
      expect(points.length).toBe(10);
    });
    it("should never give NaN for X or Y", () => {
      const points = randomData.getPoints(1000);
      points.forEach((point) => {
        expect(isNaN(point.x)).toBe(false);
        expect(isNaN(point.y)).toBe(false);
      });
    });
    it("points should be close to trueFn", () => {
      const points = randomData.getPoints(1000);
      const trueFn = randomData.trueFunction;
      points.forEach((point) => {
        const eps = 2 * (Math.log(Math.abs(trueFn(point.x))) + 0.1);
        expect(point.y).toBeLessThan(trueFn(point.x) + eps);
        expect(point.y).toBeGreaterThan(trueFn(point.x) - eps);
      });
    });
  });
});

import {
  createBasisArray,
  createBasisCol,
  createBasisMatrix,
} from "./createBasis";

describe("createBasis", () => {
  describe("createBasisArray", () => {
    it("creates an array of values for our spline basis functions 1, x, x^2, ...", () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
      ];
      const basisArr = createBasisArray(3, data);

      expect(basisArr).toEqual([
        1, // 1
        3, // x
        9, // x^2
        27, // x^3
        (3 - 0) ** 3, // pos(x - x_0) ** 3
        (3 - 1) ** 3, // pos(x - x_1) ** 3
        (3 - 2) ** 3, // pos(x - x_2) ** 3
      ]);
    });
  });

  describe("createBasisCol", () => {
    it("creates a basisCol", async () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
      ];
      const basisCol = await createBasisCol(3, data);
      expect(basisCol.rows).toBe(4 + data.length);
      expect(basisCol.cols).toBe(1);
      expect(basisCol.toArray()).toEqual([
        [1], // 1
        [3], // x
        [9], // x^2
        [27], // x^3
        [(3 - 0) ** 3], // pos(x - x_0) ** 3
        [(3 - 1) ** 3], // pos(x - x_1) ** 3
        [(3 - 2) ** 3], // pos(x - x_2) ** 3
      ]);
    });
  });

  describe("createBasisMatrix", () => {
    it("creates a basis matrix", async () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
      ];
      const basisMatrix = await createBasisMatrix(data);
      expect(basisMatrix.cols).toBe(4 + data.length);
      expect(basisMatrix.rows).toBe(data.length);
      expect(basisMatrix.toArray()).toEqual([
        // 1, x, x^2, x^3, pos(x - x_k)^3...
        [1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0],
        [1, 2, 4, 8, 8, 1, 0],
      ]);
    });
  });
});

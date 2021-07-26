import Matrix from "./matrix";

describe("Matrix", () => {
  describe("constructor", () => {
    it("creates a matrix given a 2D array of numbers", () => {
      const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      expect(matrix.rows).toBe(2);
      expect(matrix.cols).toBe(3);
      expect(matrix.toArray()).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });
  });

  describe("zeros", () => {
    it("creates a matrix with all zeros", () => {
      const matrix = Matrix.zero(2, 3);
      expect(matrix.rows).toBe(2);
      expect(matrix.cols).toBe(3);
      expect(matrix.toArray()).toEqual([
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });
  });

  describe("transpose", () => {
    it("it transposes a given matrix returning a new matrix", () => {
      const m = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      const t = m.transpose();
      expect(t.rows).toBe(3);
      expect(t.cols).toBe(2);
      expect(t.toArray()).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
      expect(m).not.toBe(t);
    });
  });

  it("adds a matrix to this one", () => {
    const m1 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const m2 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const m3 = m1.add(m2);
    expect(m3.toArray()).toEqual([
      [2, 4, 6],
      [8, 10, 12],
    ]);
    expect(m3).not.toBe(m1);
  });

  it("adds a matrix to its transpose", () => {
    const m1 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const m2 = m1.transpose();

    expect(m1.add(m2).toArray()).toEqual([
      [1 + 1, 2 + 4, 3 + 7],
      [4 + 2, 5 + 5, 6 + 8],
      [7 + 3, 8 + 6, 9 + 9],
    ]);
  });

  describe("multiply", () => {
    it("multiplies a matrix to this one", () => {
      const m1 = new Matrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);
      const m2 = new Matrix([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ]);
      const m3 = m1.multiply(m2);
      expect(m3.rows).toBe(3);
      expect(m3.cols).toBe(2);
      expect(m3.toArray()).toEqual([
        [1 * 1 + 2 * 3 + 3 * 5 + 4 * 7, 1 * 2 + 2 * 4 + 3 * 6 + 4 * 8],
        [5 * 1 + 6 * 3 + 7 * 5 + 8 * 7, 5 * 2 + 6 * 4 + 7 * 6 + 8 * 8],
        [9 * 1 + 10 * 3 + 11 * 5 + 12 * 7, 9 * 2 + 10 * 4 + 11 * 6 + 12 * 8],
      ]);
      expect(m3).not.toBe(m1);
    });

    it("multiplies a matrix to its transpose", () => {
      const m1 = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      const m2 = m1.transpose();
      const m3 = m1.multiply(m2);

      expect(m3.toArray()).toMatchInlineSnapshot(`
        Array [
          Array [
            14,
            32,
            50,
          ],
          Array [
            32,
            77,
            122,
          ],
          Array [
            50,
            122,
            194,
          ],
        ]
        `);
    });

    it("throws an error when number of cols of m1 !== number of rows of m2", () => {
      const m1 = new Matrix([[1, 2, 3]]);
      const m2 = new Matrix([[4, 5, 6]]);
      expect(() => m1.multiply(m2)).toThrowError(/Cannot multiply matrices/);
    });
  });

  describe("identity", () => {
    it("creates an n x n identity matrix of a given size", () => {
      const m = Matrix.identity(3);
      expect(m.rows).toBe(3);
      expect(m.cols).toBe(3);
      expect(m.toArray()).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });
  });

  describe("determinant", () => {
    it("calculates a determinant", () => {
      const m1 = new Matrix([
        [5, 6],
        [7, 8],
      ]);
      const m2 = new Matrix([
        [1, 2, 3, 4],
        [2, 4, 6, 8],
        [3, 6, 9, 12],
        [4, 8, 12, 16],
      ]);
      expect(m1.determinant()).toBe(5 * 8 - 6 * 7);
      expect(m2.determinant() === 0).toBeTruthy();
    });
  });

  describe("multiplyScalar", () => {
    it("multiplies this matrix with a scalar, returning a new matrix", () => {
      const m1 = Matrix.identity(3);
      const m2 = m1.multiplyScalar(2);
      expect(m2.toArray()).toEqual([
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ]);
    });
  });

  describe("inverse", () => {
    it("creates a new matrix that is the inverse of this matrix", () => {
      const m1 = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 10],
      ]);
      expect(m1.inverse().toArray()).toMatchInlineSnapshot(`
        Array [
          Array [
            -0.6666666666666661,
            -1.3333333333333337,
            1,
          ],
          Array [
            -0.6666666666666676,
            3.666666666666667,
            -1.9999999999999998,
          ],
          Array [
            1.0000000000000004,
            -2,
            0.9999999999999999,
          ],
        ]
      `);
    });
  });
});

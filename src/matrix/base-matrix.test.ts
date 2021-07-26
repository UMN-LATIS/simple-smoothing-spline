import Matrix from "./base-matrix";

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
});

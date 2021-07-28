// test against whatever the default library is in index
import Matrix from "./index";

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
    it("creates a matrix with all zeros", async () => {
      const matrix = await Matrix.zero(2, 3);
      expect(matrix.rows).toBe(2);
      expect(matrix.cols).toBe(3);
      expect(matrix.toArray()).toEqual([
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });
  });

  describe("transpose", () => {
    it("it transposes a given matrix returning a new matrix", async () => {
      const m = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      const t = await m.transpose();
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

  it("adds a matrix to this one", async () => {
    const m1 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const m2 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const m3 = await m1.add(m2);
    expect(m3.toArray()).toEqual([
      [2, 4, 6],
      [8, 10, 12],
    ]);
    expect(m3).not.toBe(m1);
  });

  it("adds a matrix to its transpose", async () => {
    const m1 = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const m2 = await m1.transpose();
    const m3 = await m1.add(m2);
    expect(m3.toArray()).toEqual([
      [1 + 1, 2 + 4, 3 + 7],
      [4 + 2, 5 + 5, 6 + 8],
      [7 + 3, 8 + 6, 9 + 9],
    ]);
  });

  describe("multiply", () => {
    it("multiplies a matrix to this one", async () => {
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
      const m3 = await m1.multiply(m2);
      expect(m3.rows).toBe(3);
      expect(m3.cols).toBe(2);
      expect(m3.toArray()).toEqual([
        [1 * 1 + 2 * 3 + 3 * 5 + 4 * 7, 1 * 2 + 2 * 4 + 3 * 6 + 4 * 8],
        [5 * 1 + 6 * 3 + 7 * 5 + 8 * 7, 5 * 2 + 6 * 4 + 7 * 6 + 8 * 8],
        [9 * 1 + 10 * 3 + 11 * 5 + 12 * 7, 9 * 2 + 10 * 4 + 11 * 6 + 12 * 8],
      ]);
      expect(m3).not.toBe(m1);
    });

    it("multiplies a matrix to its transpose", async () => {
      const m1 = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      const m2 = await m1.transpose();
      const m3 = await m1.multiply(m2);

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

    it("throws an error when number of cols of m1 !== number of rows of m2", async () => {
      const m1 = new Matrix([[1, 2, 3]]);
      const m2 = new Matrix([[4, 5, 6]]);
      const testFn = async () => await m1.multiply(m2);
      await expect(testFn).rejects.toThrowError(/Cannot multiply matrices/);
    });
  });

  describe("identity", () => {
    it("creates an n x n identity matrix of a given size", async () => {
      const m = await Matrix.identity(3);
      expect(m.rows).toBe(3);
      expect(m.cols).toBe(3);
      expect(m.toArray()).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });

    it("can include an optional scalar", async () => {
      const scalar = 2;
      const m = await Matrix.identity(3, scalar);
      expect(m.rows).toBe(3);
      expect(m.cols).toBe(3);
      expect(m.toArray()).toEqual([
        [scalar, 0, 0],
        [0, scalar, 0],
        [0, 0, scalar],
      ]);
    });
  });

  describe("determinant", () => {
    it("calculates a determinant", async () => {
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
      expect(await m1.determinant()).toBeCloseTo(5 * 8 - 6 * 7);
      expect((await m2.determinant()) === 0).toBeTruthy();
    });
  });

  describe("multiplyScalar", () => {
    it("multiplies this matrix with a scalar, returning a new matrix", async () => {
      const m1 = await Matrix.identity(3);
      const m2 = await m1.multiplyScalar(2);
      expect(m2.toArray()).toEqual([
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ]);
    });
  });

  describe("inverse", () => {
    it("creates a new matrix that is the inverse of this matrix", async () => {
      const m1 = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 10],
      ]);
      const m1inv = await m1.inverse();
      const expectedInverse = [
        [-2 / 3, -4 / 3, 1],
        [-2 / 3, 11 / 3, -2],
        [1, -2, 1],
      ];
      m1inv.toArray().forEach((row, i) => {
        row.forEach((val, j) =>
          expect(val).toBeCloseTo(expectedInverse[i][j], 6)
        );
      });
    });

    describe("get", () => {
      it("gets a value of a matrix", () => {
        const m = new Matrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 10],
        ]);
        expect(m.get(1, 2)).toBe(6);
      });
    });
    describe("set", () => {
      it("sets a value of a matrix", () => {
        const m = new Matrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 10],
        ]);
        m.set(1, 2, 10);
        expect(m.get(1, 2)).toBe(10);
      });
    });
  });

  // describe("solve", async () => {
  //   it("solves a system of linear equations", async () => {
  //     // pretend we're looking for coeffs of a polynomial
  //     const cubic = (x: number) => 2 + 3 * x + -4 * x ** 2 + 5 * x ** 3;
  //     // we have a system of 4 coeffs, so we need 4 equations
  //     const xs = [1, 2, 3, 4];
  //     const ys = xs.map(cubic);

  //     // system of equations
  //     // a * 1 + b * x^2 + c * x^3 + d * x^4 = y
  //     const A = new Matrix([...xs.map((x) => [1, x, x ** 2, x ** 3])]);
  //     const b = new Matrix([ys]).transpose();
  //     const coeffs = await Matrix.solve(A, b);
  //     const expectedCoeffs = [2, 3, -4, 5];
  //     const coeffArray = coeffs.toArray();
  //     coeffArray.flat().forEach((coeff, i) => {
  //       expect(coeff).toBeCloseTo(expectedCoeffs[i]);
  //     });
  //   });
  // });
});

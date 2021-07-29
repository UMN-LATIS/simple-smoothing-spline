import { MatrixLike, MatrixMapperFunction } from "../types";

export default class Matrix implements MatrixLike {
  #data: number[][];

  constructor(data: number[][]) {
    this.#data = data;
  }

  get rows() {
    return this.#data.length;
  }

  get cols() {
    return this.#data[0].length;
  }

  toArray(): number[][] {
    return this.#data;
  }
  get(row: number, col: number): number {
    return this.#data[row][col];
  }

  set(row: number, col: number, value: number): void {
    this.#data[row][col] = value;
  }

  static zero(rows: number, cols: number): Matrix {
    const arr = new Array(rows).fill(0).map((row) => new Array(cols).fill(0));
    return new Matrix(arr);
  }

  static identity(rows: number, columns: number): Matrix {
    const ident = Matrix.zero(rows, columns);
    for (let i = 0; i < rows; i++) {
      ident.set(i, i, 1);
    }
    return ident;
  }

  map(fn: MatrixMapperFunction): Matrix {
    const newArray = this.#data.map((rowVector, i) =>
      rowVector.map((currentValue, j) => fn(currentValue, i, j))
    );
    return new Matrix(newArray);
  }

  /**
   * returns a NEW transposed matrix
   */
  transpose(): Matrix {
    const transposedRows = this.cols;
    const transposedCols = this.rows;
    const transposedMatrix = Matrix.zero(transposedRows, transposedCols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const currentValue = this.get(i, j);
        transposedMatrix.set(j, i, currentValue);
      }
    }
    return transposedMatrix;
  }

  determinant(): number {
    throw new Error("Method not implemented.");
  }

  inverse(): Matrix {
    throw new Error("Method not implemented.");
  }

  multiply(matrix: Matrix): Matrix {
    throw new Error("Method not implemented.");
  }

  multiplyScalar(scalar: number): Matrix {
    throw new Error("Method not implemented.");
  }

  add(otherMatrix: Matrix): Matrix {
    const adder = (current: number, row: number, col: number) =>
      current + otherMatrix.get(row, col);
    return this.map(adder);
  }
}

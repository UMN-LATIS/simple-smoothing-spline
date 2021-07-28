import eigen, { Matrix as EigenMatrix } from "eigen";
import create2DArray from "../helpers/create2DArray";
import { MatrixLike, MatrixMapperFunction } from "../types";

// class EigenMatrix extends eigen.Matrix {}

function eigenMatrixToArray(M: EigenMatrix): number[][] {
  // TODO: Find if there's a more built-in approach to
  // converting an eigen matrix to an array.
  const arr = [];
  for (let i = 0; i < M.rows(); i++) {
    const row = [];
    for (let j = 0; j < M.cols(); j++) {
      row.push(M.get(i, j));
    }
    arr.push(row);
  }
  return arr;
}

export default class Matrix implements MatrixLike<Matrix> {
  // EigenMatrix ops are async so we cannot create #eigenMatrix
  // in the constructor. If we're given an array, we'll store it
  // in #data and create the matrix when we do our first operation.
  _data: number[][] = [[]];
  _eigenMatrix: EigenMatrix | null = null;
  rows: number = 0;
  cols: number = 0;

  constructor(
    data: number[][] | EigenMatrix | Matrix | number,
    numCols?: number
  ) {
    // if data is a number, it's the number of rows
    // and we'll create a matrix of that size
    if (typeof data === "number") {
      this._data = create2DArray(data, numCols || data);
      this.rows = data;
      this.cols = numCols || data;
      return;
    }

    // if data is a 2D array, we'll put it in temp data
    // and create the eigen matrix when we do our first op
    if (Array.isArray(data)) {
      this._data = data;
      this.rows = data.length;
      this.cols = data[0].length;
      return;
    }

    // if data is an eigen matrix, we'll just use it
    if (data instanceof eigen.Matrix) {
      this._data = eigenMatrixToArray(data);
      this._eigenMatrix = data;
      this.rows = data.rows();
      this.cols = data.cols();
      return;
    }

    // if this is a matrix, let's just copy the existing state
    if (data instanceof Matrix && data._eigenMatrix) {
      this._eigenMatrix = data._eigenMatrix;
      this._data = data._data;
      this.rows = data.rows;
      this.cols = data.cols;
      return;
    }
  }

  async #getEigenMatrix(): Promise<EigenMatrix> {
    if (this._eigenMatrix) return this._eigenMatrix;
    if (!this._eigenMatrix && !this._data) {
      throw Error("Cannot get this EigenMatrix: No #eigenMatrix or #data");
    }

    await eigen.ready;
    this._eigenMatrix = new eigen.Matrix(this._data);
    return this._eigenMatrix;
  }

  get(row: number, col: number): number {
    return this._data[row][col];
  }

  set(row: number, col: number, value: number): void {
    this._data[row][col] = value;

    // update eigenMatrix if it exists
    if (this._eigenMatrix) {
      this._eigenMatrix.set(row, col, value);
    }
  }

  map(fn: MatrixMapperFunction): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }

  async transpose(): Promise<Matrix> {
    const M = await this.#getEigenMatrix();
    return new Matrix(M.transpose());
  }

  async determinant(): Promise<number> {
    const M = await this.#getEigenMatrix();
    return M.det();
  }

  async inverse(): Promise<Matrix> {
    const M = await this.#getEigenMatrix();
    return new Matrix(M.inverse());
  }

  async multiply(matrix: Matrix): Promise<Matrix> {
    if (this.cols !== matrix.rows) {
      throw Error(
        `Cannot multiply matrices: cols of left matrix (${this.rows}x${this.cols}) must equal rows of right matrix (${matrix.rows}x${matrix.cols}).`
      );
    }
    const M = await this.#getEigenMatrix();
    const N = await matrix.#getEigenMatrix();
    return new Matrix(M.matMul(N));
  }

  async multiplyScalar(scalar: number): Promise<Matrix> {
    const M = await this.#getEigenMatrix();
    return new Matrix(M.mul(scalar));
  }

  async add(matrix: Matrix): Promise<Matrix> {
    const M = await this.#getEigenMatrix();
    const N = await matrix.#getEigenMatrix();
    return new Matrix(M.matAdd(N));
  }

  static identity(size: number, scalar: number = 1): Promise<Matrix> {
    const ident = create2DArray(size, size);
    for (let i = 0; i < size; i++) {
      ident[i][i] = scalar;
    }
    return Promise.resolve(new Matrix(ident));
  }

  static zero(rows: number, cols: number): Promise<Matrix> {
    const zeros = create2DArray(rows, cols);
    return Promise.resolve(new Matrix(zeros));
  }

  toArray(): number[][] {
    return this._data;
  }

  toSVD(): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }

  solve(): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }
}

import { Matrix as EigenMatrix } from "eigen";
import { MatrixLike, MatrixMapperFunction } from "../types";

export default class Matrix implements MatrixLike {
  #eigenMatrix: EigenMatrix;

  constructor(
    dataOrNumRows: number[][] | EigenMatrix | Matrix,
    numCols?: number
  ) {
    if (typeof dataOrNumRows === "number") {
      this.#eigenMatrix = new EigenMatrix(dataOrNumRows, numCols);
      return;
    }

    if (dataOrNumRows instanceof EigenMatrix) {
      this.#eigenMatrix = dataOrNumRows;
      return;
    }

    if (dataOrNumRows instanceof Matrix) {
      this.#eigenMatrix = new EigenMatrix(dataOrNumRows.#eigenMatrix);
      return;
    }

    this.#eigenMatrix = new EigenMatrix(dataOrNumRows);
  }

  get rows(): number {
    return this.#eigenMatrix.rows();
  }

  get cols(): number {
    return this.#eigenMatrix.cols();
  }

  toArray(): number[][] {
    // TODO: Find if there's a more built-in approach to
    // converting an eigen matrix to an array.
    const arr = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(this.#eigenMatrix.get(i, j));
      }
      arr.push(row);
    }
    return arr;
  }

  get(row: number, col: number): number {
    return this.#eigenMatrix.get(row, col);
  }

  set(row: number, col: number, value: number): void {
    this.#eigenMatrix.set(row, col, value);
  }

  map(fn: MatrixMapperFunction): Matrix {
    throw new Error("Method not implemented.");
  }

  transpose(): Matrix {
    return new Matrix(this.#eigenMatrix.transpose());
  }

  determinant(): number {
    return this.#eigenMatrix.det();
  }

  inverse(): Matrix {
    return new Matrix(this.#eigenMatrix.inverse());
  }

  multiply(matrix: Matrix): Matrix {
    const m = this.#eigenMatrix.matMul(matrix.#eigenMatrix);
    return new Matrix(m);
  }

  multiplyScalar(scalar: number): Matrix {
    return new Matrix(this.#eigenMatrix.mul(scalar));
  }

  add(matrix: Matrix): Matrix {
    const sum = this.#eigenMatrix.matAdd(matrix.#eigenMatrix);
    return new Matrix(sum);
  }

  static identity(size: number, scalar?: number): Matrix {
    if (!scalar) return new Matrix(EigenMatrix.identity(size, size));

    const valuesForDiagonal = new Array(size).map((x) => scalar);
    const vec = new EigenMatrix(valuesForDiagonal);
    return new Matrix(EigenMatrix.diagonal(vec));
  }

  static zero(rows: number, cols: number): Matrix {
    return new Matrix(new EigenMatrix(rows, cols));
  }

  toSVD(): MatrixLike {
    throw new Error("Method not implemented.");
  }
}

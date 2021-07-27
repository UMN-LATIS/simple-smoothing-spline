import {
  Matrix as MLMatrix,
  inverse,
  determinant,
  solve,
  SingularValueDecomposition,
} from "ml-matrix";
import { MatrixLike, MatrixMapperFunction } from "../types";

export default class Matrix implements MatrixLike {
  #mlMatrix: MLMatrix;

  constructor(data: number[][] | MLMatrix | Matrix = [[]]) {
    if (data instanceof MLMatrix) {
      this.#mlMatrix = data;
      return;
    }

    if (data instanceof Matrix) {
      this.#mlMatrix = new MLMatrix(data.#mlMatrix);
      return;
    }

    this.#mlMatrix = new MLMatrix(data);
  }

  static zero(rows: number, cols: number): Matrix {
    return new Matrix(new MLMatrix(rows, cols));
  }

  static identity(
    size: number,
    { scalar = 1 }: { scalar?: number } = {}
  ): Matrix {
    const identity = MLMatrix.identity(size, size, scalar);
    return new Matrix(identity);
  }

  get rows(): number {
    return this.#mlMatrix.rows;
  }

  get cols(): number {
    return this.#mlMatrix.columns;
  }

  toArray(): number[][] {
    return this.#mlMatrix.to2DArray();
  }

  get(row: number, col: number): number {
    return this.#mlMatrix.get(row, col);
  }

  set(row: number, col: number, value: number): void {
    throw new Error("Method not implemented.");
  }
  map(fn: MatrixMapperFunction): Matrix {
    throw new Error("Method not implemented.");
  }

  transpose(): Matrix {
    return new Matrix(this.#mlMatrix.transpose());
  }

  determinant(): number {
    return determinant(this.#mlMatrix);
  }

  inverse(): Matrix {
    const inv = inverse(this.#mlMatrix);
    return new Matrix(inv);
  }

  multiply(matrix: Matrix): Matrix {
    if (this.cols !== matrix.rows) {
      throw new Error(
        `Cannot multiply matrices. This matrix is ${this.rows} x ${this.cols}. Given matrix is ${matrix.rows} x ${matrix.cols}. this.cols !== givenMatrix.rows`
      );
    }
    const product = this.#mlMatrix.mmul(matrix.#mlMatrix);
    return new Matrix(product);
  }

  multiplyScalar(scalar: number): Matrix {
    const product = this.#mlMatrix.mul(scalar);
    return new Matrix(product);
  }

  add(otherMatrix: Matrix): Matrix {
    const sum = this.#mlMatrix.add(otherMatrix.#mlMatrix);
    return new Matrix(sum);
  }

  /**
   * Singular Value Decomposition of a matrix
   */
  toSVD(): { U: Matrix; S: Matrix; V: Matrix } {
    const svd = new SingularValueDecomposition(this.#mlMatrix, {
      autoTranspose: true,
    });
    return {
      U: new Matrix(svd.leftSingularVectors),
      S: new Matrix(svd.diagonalMatrix),
      V: new Matrix(svd.rightSingularVectors),
    };
  }

  static solve(leftHandSide: Matrix, rightHandSide: Matrix): Matrix {
    const SVD = new SingularValueDecomposition(leftHandSide.#mlMatrix, {
      autoTranspose: true,
    });
    const solution = SVD.solve(rightHandSide.#mlMatrix);
    return new Matrix(solution);
  }
}

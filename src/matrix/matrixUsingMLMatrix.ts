import {
  Matrix as MLMatrix,
  inverse,
  pseudoInverse,
  determinant,
  SingularValueDecomposition,
} from "ml-matrix";
import { MatrixLike, MatrixMapperFunction } from "../types";

export default class Matrix implements MatrixLike<Matrix> {
  _mlMatrix: MLMatrix;

  constructor(data: number[][] | MLMatrix | Matrix = [[]]) {
    if (data instanceof MLMatrix) {
      this._mlMatrix = data;
      return;
    }

    if (data instanceof Matrix) {
      this._mlMatrix = new MLMatrix(data._mlMatrix);
      return;
    }

    this._mlMatrix = new MLMatrix(data);
  }

  static zero(rows: number, cols: number): Matrix {
    return new Matrix(new MLMatrix(rows, cols));
  }

  static identity(size: number, scalar: number = 1): Matrix {
    const identity = MLMatrix.identity(size, size, scalar);
    return new Matrix(identity);
  }

  get rows(): number {
    return this._mlMatrix.rows;
  }

  get cols(): number {
    return this._mlMatrix.columns;
  }

  toArray(): number[][] {
    return this._mlMatrix.to2DArray();
  }

  get(row: number, col: number): number {
    return this._mlMatrix.get(row, col);
  }

  set(row: number, col: number, value: number): void {
    this._mlMatrix.set(row, col, value);
  }
  map(fn: MatrixMapperFunction): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }

  transpose(): Promise<Matrix> {
    return new Promise((resolve) => {
      resolve(new Matrix(this._mlMatrix.transpose()));
    });
  }

  determinant(): Promise<number> {
    return Promise.resolve(determinant(this._mlMatrix));
  }

  inverse(): Promise<Matrix> {
    return new Promise((resolve) => {
      // attempt an inverse and if that doesn't work,
      // try pseudoinverse. This seems to be faster than first
      // calculating the determeinant to see if it's invertible
      // and faster than calculating the pseudoinverse all the time
      try {
        const inv = inverse(this._mlMatrix);
        resolve(new Matrix(inv));
      } catch (e) {
        // if inverse does not exist, use svd
        const invWithSvd = inverse(this._mlMatrix, true);
        resolve(new Matrix(invWithSvd));
      }
    });
  }

  multiply(matrix: Matrix): Promise<Matrix> {
    return new Promise((resolve, reject) => {
      if (this.cols !== matrix.rows) {
        throw new Error(
          `Cannot multiply matrices. Cols of left matrix (${this.rows}x${this.cols}) must equal rows of right matrix (${matrix.rows}x${matrix.cols}).`
        );
      }
      const product = this._mlMatrix.mmul(matrix._mlMatrix);
      return resolve(new Matrix(product));
    });
  }

  multiplyScalar(scalar: number): Promise<Matrix> {
    return new Promise((resolve) => {
      const product = this._mlMatrix.mul(scalar);
      resolve(new Matrix(product));
    });
  }

  add(otherMatrix: Matrix): Promise<Matrix> {
    // TODO: check that rows and cols match
    // maybe mlMatrix does this already? We should test.
    return new Promise((resolve) => {
      const sum = this._mlMatrix.add(otherMatrix._mlMatrix);
      resolve(new Matrix(sum));
    });
  }

  /**
   * Singular Value Decomposition of a matrix
   */
  toSVD(): Promise<{ U: Matrix; S: Matrix; V: Matrix }> {
    return new Promise((resolve) => {
      const svd = new SingularValueDecomposition(this._mlMatrix, {
        autoTranspose: true,
      });

      resolve({
        U: new Matrix(svd.leftSingularVectors),
        S: new Matrix(svd.diagonalMatrix),
        V: new Matrix(svd.rightSingularVectors),
      });
    });
  }

  static solve(leftHandSide: Matrix, rightHandSide: Matrix): Promise<Matrix> {
    return new Promise((resolve) => {
      const SVD = new SingularValueDecomposition(leftHandSide._mlMatrix, {
        autoTranspose: true,
      });
      const solution = SVD.solve(rightHandSide._mlMatrix);
      resolve(new Matrix(solution));
    });
  }
}

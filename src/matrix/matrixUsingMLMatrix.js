import {
  Matrix as MLMatrix,
  inverse,
  determinant,
  SingularValueDecomposition
} from "../../_snowpack/pkg/ml-matrix.js";
export default class Matrix {
  #mlMatrix;
  constructor(data = [[]]) {
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
  static zero(rows, cols) {
    return new Matrix(new MLMatrix(rows, cols));
  }
  static identity(size, scalar = 1) {
    const identity = MLMatrix.identity(size, size, scalar);
    return new Matrix(identity);
  }
  get rows() {
    return this.#mlMatrix.rows;
  }
  get cols() {
    return this.#mlMatrix.columns;
  }
  toArray() {
    return this.#mlMatrix.to2DArray();
  }
  get(row, col) {
    return this.#mlMatrix.get(row, col);
  }
  set(row, col, value) {
    this.#mlMatrix.set(row, col, value);
  }
  map(fn) {
    throw new Error("Method not implemented.");
  }
  transpose() {
    return new Promise((resolve) => {
      resolve(new Matrix(this.#mlMatrix.transpose()));
    });
  }
  determinant() {
    return Promise.resolve(determinant(this.#mlMatrix));
  }
  inverse() {
    return new Promise((resolve) => {
      try {
        const inv = inverse(this.#mlMatrix);
        resolve(new Matrix(inv));
      } catch (e) {
        const invWithSvd = inverse(this.#mlMatrix, true);
        resolve(new Matrix(invWithSvd));
      }
    });
  }
  multiply(matrix) {
    return new Promise((resolve, reject) => {
      if (this.cols !== matrix.rows) {
        throw new Error(`Cannot multiply matrices. Cols of left matrix (${this.rows}x${this.cols}) must equal rows of right matrix (${matrix.rows}x${matrix.cols}).`);
      }
      const product = this.#mlMatrix.mmul(matrix.#mlMatrix);
      return resolve(new Matrix(product));
    });
  }
  multiplyScalar(scalar) {
    return new Promise((resolve) => {
      const product = this.#mlMatrix.mul(scalar);
      resolve(new Matrix(product));
    });
  }
  add(otherMatrix) {
    return new Promise((resolve) => {
      const sum = this.#mlMatrix.add(otherMatrix.#mlMatrix);
      resolve(new Matrix(sum));
    });
  }
  toSVD() {
    return new Promise((resolve) => {
      const svd = new SingularValueDecomposition(this.#mlMatrix, {
        autoTranspose: true
      });
      resolve({
        U: new Matrix(svd.leftSingularVectors),
        S: new Matrix(svd.diagonalMatrix),
        V: new Matrix(svd.rightSingularVectors)
      });
    });
  }
  static solve(leftHandSide, rightHandSide) {
    return new Promise((resolve) => {
      const SVD = new SingularValueDecomposition(leftHandSide.#mlMatrix, {
        autoTranspose: true
      });
      const solution = SVD.solve(rightHandSide.#mlMatrix);
      resolve(new Matrix(solution));
    });
  }
}

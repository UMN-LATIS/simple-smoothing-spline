import eigen from "../../_snowpack/pkg/eigen.js";
import create2DArray from "../helpers/create2DArray.js";
function eigenMatrixToArray(M) {
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
export default class Matrix {
  constructor(data, numCols) {
    this._data = [[]];
    this._eigenMatrix = null;
    this._svd = null;
    this._svdIsDirty = true;
    this.rows = 0;
    this.cols = 0;
    if (typeof data === "number") {
      this._data = create2DArray(data, numCols || data);
      this.rows = data;
      this.cols = numCols || data;
      return;
    }
    if (Array.isArray(data)) {
      this._data = data;
      this.rows = data.length;
      this.cols = data[0].length;
      return;
    }
    if (data instanceof eigen.Matrix) {
      this._data = eigenMatrixToArray(data);
      this._eigenMatrix = data;
      this.rows = data.rows();
      this.cols = data.cols();
      return;
    }
    if (data instanceof Matrix && data._eigenMatrix) {
      this._eigenMatrix = data._eigenMatrix;
      this._data = data._data;
      this.rows = data.rows;
      this.cols = data.cols;
      return;
    }
  }
  async #getEigenMatrix() {
    if (this._eigenMatrix)
      return this._eigenMatrix;
    if (!this._eigenMatrix && !this._data) {
      throw Error("Cannot get this EigenMatrix: No #eigenMatrix or #data");
    }
    await eigen.ready;
    this._eigenMatrix = new eigen.Matrix(this._data);
    return this._eigenMatrix;
  }
  async #getSVD() {
    if (this._svd && !this._svdIsDirty)
      return this._svd;
    const M = await this.#getEigenMatrix();
    this._svd = eigen.Decompositions.svd(M, true);
    this._svdIsDirty = false;
    return this._svd;
  }
  get(row, col) {
    return this._data[row][col];
  }
  set(row, col, value) {
    this._data[row][col] = value;
    if (this._eigenMatrix) {
      this._eigenMatrix.set(row, col, value);
    }
    if (this._svd) {
      this._svdIsDirty = true;
    }
  }
  map(fn) {
    throw new Error("Method not implemented.");
  }
  async transpose() {
    const M = await this.#getEigenMatrix();
    return new Matrix(M.transpose());
  }
  async determinant() {
    const M = await this.#getEigenMatrix();
    return M.det();
  }
  async inverse(useSVD = true) {
    if (!useSVD) {
      const M = await this.#getEigenMatrix();
      return new Matrix(M.inverse());
    }
    const {U, sv, V} = await this.#getSVD();
    const Ut = U.transpose();
    const sigmaVector = eigenMatrixToArray(sv).flat();
    const sigmaInvVector = new eigen.Matrix(sigmaVector.map((sigma) => sigma ? 1 / sigma : 0));
    const sigmaInverseMatrix = new eigen.Matrix(V.cols(), Ut.rows());
    sigmaInverseMatrix.setBlock(0, 0, eigen.Matrix.diagonal(sigmaInvVector));
    const Ainv = V.matMul(sigmaInverseMatrix).matMul(Ut);
    return new Matrix(Ainv);
  }
  static async diagonal(vector, rows, columns) {
    await eigen.ready;
    const diag = eigen.Matrix.diagonal(new eigen.Matrix(vector));
    if (!rows || !columns)
      return new Matrix(diag);
    const M = new eigen.Matrix(rows, columns);
    M.setBlock(0, 0, diag);
    return new Matrix(M);
  }
  async multiply(matrix) {
    if (this.cols !== matrix.rows) {
      throw Error(`Cannot multiply matrices: cols of left matrix (${this.rows}x${this.cols}) must equal rows of right matrix (${matrix.rows}x${matrix.cols}).`);
    }
    const M = await this.#getEigenMatrix();
    const N = await matrix.#getEigenMatrix();
    return new Matrix(M.matMul(N));
  }
  async multiplyScalar(scalar) {
    const M = await this.#getEigenMatrix();
    return new Matrix(M.mul(scalar));
  }
  async add(matrix) {
    const M = await this.#getEigenMatrix();
    const N = await matrix.#getEigenMatrix();
    return new Matrix(M.matAdd(N));
  }
  static identity(size, scalar = 1) {
    const ident = create2DArray(size, size);
    for (let i = 0; i < size; i++) {
      ident[i][i] = scalar;
    }
    return Promise.resolve(new Matrix(ident));
  }
  static zero(rows, cols) {
    const zeros = create2DArray(rows, cols);
    return Promise.resolve(new Matrix(zeros));
  }
  toArray() {
    return this._data;
  }
  async toSVD() {
    const {U, sv, V} = await this.#getSVD();
    return {
      U: new Matrix(U),
      sigmaVector: eigenMatrixToArray(sv).flat(),
      V: new Matrix(V)
    };
  }
  solve() {
    throw new Error("Method not implemented.");
  }
  static _flushMemory() {
    eigen.GC.flush();
  }
}

import eigen from "eigen";
import create2DArray from "../helpers/create2DArray";
import {
  MatrixLike,
  MatrixMapperFunction,
  SingleValueDecomposition,
} from "../types";

type EigenMatrixType = eigen.Matrix;

// class EigenMatrix extends eigen.Matrix {}

function eigenMatrixToArray(M: EigenMatrixType): number[][] {
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

// See: http://pillowlab.princeton.edu/teaching/statneuro2018/slides/notes02_SVD.pdf
interface EigenSVD {
  // leftSingular
  U: EigenMatrixType;
  sv: EigenMatrixType;
  // rightSingular
  V: EigenMatrixType;
}

export default class Matrix implements MatrixLike<Matrix> {
  // EigenMatrix ops are async so we cannot create _eigenMatrix
  // in the constructor. If we're given an array, we'll store it
  // in _data and create the matrix when we do our first operation.
  _data: number[][] = [[]];
  // _eigenMatrix: EigenMatrix | null = null;
  _eigenMatrix: EigenMatrixType | null = null;
  _svd: EigenSVD | null = null;
  _svdIsDirty: boolean = true;
  rows: number = 0;
  cols: number = 0;

  constructor(
    data: number[][] | EigenMatrixType | Matrix | number,
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

  async _getEigenMatrix(): Promise<EigenMatrixType> {
    if (this._eigenMatrix) return this._eigenMatrix;
    if (!this._eigenMatrix && !this._data) {
      throw Error("Cannot get this EigenMatrix: No _eigenMatrix or _data");
    }

    await eigen.ready;
    this._eigenMatrix = new eigen.Matrix(this._data);
    return this._eigenMatrix;
  }

  async _getSVD(): Promise<EigenSVD> {
    if (this._svd && !this._svdIsDirty) return this._svd;

    // if no SVD exists, calculate it
    const M = await this._getEigenMatrix();
    this._svd = eigen.Decompositions.svd(M, true);
    this._svdIsDirty = false;
    return this._svd;
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

    // mark the SVD as needing update
    // ugh. I hate this. Let's get rid of mutability?
    if (this._svd) {
      this._svdIsDirty = true;
    }
  }

  map(fn: MatrixMapperFunction): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }

  async transpose(): Promise<Matrix> {
    const M = await this._getEigenMatrix();
    return new Matrix(M.transpose());
  }

  async determinant(): Promise<number> {
    const M = await this._getEigenMatrix();
    return M.det();
  }

  async inverse(useSVD = true): Promise<Matrix> {
    if (!useSVD) {
      const M = await this._getEigenMatrix();
      return new Matrix(M.inverse());
    }

    // see this excellent description of SVDecomposition:
    // https://pillowlab.princeton.edu/teaching/statneuro2018/slides/notes02_SVD.pdf

    // In short, to find A^-1, we do:
    // A^-1 = V * S^-1 * U^T
    // where S^-1 = [[1/sv{0}, 0...], [0, 1/sv{1}...], ...]

    // U  is the left singular matrix
    // sv is the vector of sigma values
    // V  is the right singular matrix
    const { U, sv, V } = await this._getSVD();

    const Ut = U.transpose();

    // find the reciprocal of each sigma
    // if signma === 0, we do the pseudo inverse
    // that is instead of taking the reciprocal a sigma,
    // (which would give a divide by zero error), we just
    // leave it as 0
    const sigmaVector: number[] = eigenMatrixToArray(sv).flat();
    const sigmaInvVector = new eigen.Matrix(
      sigmaVector.map((sigma) => (sigma ? 1 / sigma : 0))
    );

    // now turn that vector into a matrix of sigma inverse values
    // fill in 0's for the rest
    const sigmaInverseMatrix = new eigen.Matrix(V.cols(), Ut.rows());
    sigmaInverseMatrix.setBlock(0, 0, eigen.Matrix.diagonal(sigmaInvVector));
    const Ainv = V.matMul(sigmaInverseMatrix).matMul(Ut);
    return new Matrix(Ainv);
  }

  // creates a diagonal matrix of rows x cols. Fills in diagonal with
  // the values in the vector. The remaining values are 0.
  static async diagonal(vector: number[], rows?: number, columns?: number) {
    await eigen.ready;
    const diag = eigen.Matrix.diagonal(new eigen.Matrix(vector));
    if (!rows || !columns) return new Matrix(diag);

    // if we have a specified number of rows and columns,
    // we need to create a matrix of that size
    const M = new eigen.Matrix(rows, columns);
    M.setBlock(0, 0, diag);
    return new Matrix(M);
  }

  async multiply(matrix: Matrix): Promise<Matrix> {
    if (this.cols !== matrix.rows) {
      throw Error(
        `Cannot multiply matrices: cols of left matrix (${this.rows}x${this.cols}) must equal rows of right matrix (${matrix.rows}x${matrix.cols}).`
      );
    }
    const M = await this._getEigenMatrix();
    const N = await matrix._getEigenMatrix();
    return new Matrix(M.matMul(N));
  }

  async multiplyScalar(scalar: number): Promise<Matrix> {
    const M = await this._getEigenMatrix();
    return new Matrix(M.mul(scalar));
  }

  async add(matrix: Matrix): Promise<Matrix> {
    const M = await this._getEigenMatrix();
    const N = await matrix._getEigenMatrix();
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

  async toSVD(): Promise<SingleValueDecomposition<Matrix>> {
    const { U, sv, V } = await this._getSVD();
    return {
      U: new Matrix(U),
      sigmaVector: eigenMatrixToArray(sv).flat(),
      V: new Matrix(V),
    };
  }

  solve(): Promise<Matrix> {
    throw new Error("Method not implemented.");
  }

  static _flushMemory(): void {
    eigen.GC.flush();
  }
}

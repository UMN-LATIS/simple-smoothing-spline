declare module "eigen" {
  // see: https://bertrandbev.github.io/eigen-js/#/matrix
  // not comprehensive.
  // just the types we need for now
  export class Matrix {
    constructor(
      dataOrNumberOfRows: number[][] | Matrix | Array<number> | number,
      cols?: number
    );
    static identity(rows: number, cols: number): Matrix;
    static diagonal(vector: Matrix): Matrix;
    rows(): number;
    cols(): number;
    get(i: number, j: number): number;
    set(i: number, j: number, value: number): Matrix;
    det(): number;
    mul(scalar: number): Matrix;
    matMul(matrix: Matrix): Matrix;
    matAdd(matrix: Matrix): Matrix;
    transpose(): Matrix;
    inverse(): Matrix;
    diagonal(vector: Matrix): Matrix;
    setBlock(topLeftRow: number, topLeftCol: number, M: Matrix): Matrix;
  }

  export interface SVDecomposition {
    U: Matrix; // left singular matrix
    sv: Matrix; // vector of sigma values
    V: Matrix; // right singular matrix
  }
  export const Decompositions: {
    svd(
      matrix: Matrix,
      onlyKeepNonZeroSingularValues?: boolean
    ): SVDecomposition;
  };

  export const ready: Promise<void>;
}

import { MatrixLike, MatrixMapperFunction } from "../types";

export default class MatrixUsingEigen implements MatrixLike {
  rows: number;
  cols: number;
  toArray(): number[][] {
    throw new Error("Method not implemented.");
  }
  get(row: number, col: number): number {
    throw new Error("Method not implemented.");
  }
  set(row: number, col: number, value: number): void {
    throw new Error("Method not implemented.");
  }
  map(fn: MatrixMapperFunction): MatrixLike {
    throw new Error("Method not implemented.");
  }
  transpose(): MatrixLike {
    throw new Error("Method not implemented.");
  }
  determinant(): number {
    throw new Error("Method not implemented.");
  }
  inverse(): MatrixLike {
    throw new Error("Method not implemented.");
  }
  multiply(matrix: MatrixLike): MatrixLike {
    throw new Error("Method not implemented.");
  }
  multiplyScalar(scalar: number): MatrixLike {
    throw new Error("Method not implemented.");
  }
  add(matrix: MatrixLike): MatrixLike {
    throw new Error("Method not implemented.");
  }
}

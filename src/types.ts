export interface Point {
  x: number;
  y: number;
}

export type SplineFunction = (x: number) => number;

export type MatrixMapperFunction = (
  currentValue: number,
  row: number,
  column: number
) => number;

export interface MatrixLike {
  rows: number;
  cols: number;
  toArray(): number[][];
  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;
  map(fn: MatrixMapperFunction): MatrixLike;
  transpose(): MatrixLike;
  determinant(): number;
  inverse(): MatrixLike;
  multiply(matrix: MatrixLike): MatrixLike;
  multiplyScalar(scalar: number): MatrixLike;
  add(matrix: MatrixLike): MatrixLike;
}

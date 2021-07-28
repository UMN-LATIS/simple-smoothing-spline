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

export interface MatrixLike<T> {
  rows: number;
  cols: number;
  toArray(): number[][];
  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;
  map(fn: MatrixMapperFunction): Promise<T>;
  transpose(): Promise<T>;
  determinant(): Promise<number>;
  inverse(): Promise<T>;
  multiply(matrix: T): Promise<T>;
  multiplyScalar(scalar: number): Promise<T>;
  add(matrix: T): Promise<T>;
}

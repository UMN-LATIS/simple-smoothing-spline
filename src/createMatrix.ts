import { matrix, Matrix } from "mathjs";

function createMatrix(
  rows: number,
  cols: number,
  fn: (i: number, j: number) => number
): Matrix {
  const m = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(fn(i, j));
    }
    m.push(row);
  }
  return matrix(m);
}

export default createMatrix;

export default class Matrix {
  #data;
  constructor(data) {
    this.#data = data;
  }
  get rows() {
    return this.#data.length;
  }
  get cols() {
    return this.#data[0].length;
  }
  toArray() {
    return this.#data;
  }
  get(row, col) {
    return this.#data[row][col];
  }
  set(row, col, value) {
    this.#data[row][col] = value;
  }
  static zero(rows, cols) {
    const arr = new Array(rows).fill(0).map((row) => new Array(cols).fill(0));
    return new Matrix(arr);
  }
  static identity(rows, columns) {
    const ident = Matrix.zero(rows, columns);
    for (let i = 0; i < rows; i++) {
      ident.set(i, i, 1);
    }
    return ident;
  }
  map(fn) {
    const newArray = this.#data.map((rowVector, i) => rowVector.map((currentValue, j) => fn(currentValue, i, j)));
    return new Matrix(newArray);
  }
  transpose() {
    const transposedRows = this.cols;
    const transposedCols = this.rows;
    const transposedMatrix = Matrix.zero(transposedRows, transposedCols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const currentValue = this.get(i, j);
        transposedMatrix.set(j, i, currentValue);
      }
    }
    return transposedMatrix;
  }
  determinant() {
    throw new Error("Method not implemented.");
  }
  inverse() {
    throw new Error("Method not implemented.");
  }
  multiply(matrix) {
    throw new Error("Method not implemented.");
  }
  multiplyScalar(scalar) {
    throw new Error("Method not implemented.");
  }
  add(otherMatrix) {
    const adder = (current, row, col) => current + otherMatrix.get(row, col);
    return this.map(adder);
  }
}

import createMatrix from "./createMatrix";

describe("createMatrix", () => {
  it("creates a matrix of rows, cols using a given function", () => {
    const matrix = createMatrix(5, 4, (i, j) => i * j);
    expect(matrix).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Array [
      0,
      0,
      0,
      0,
    ],
    Array [
      0,
      1,
      2,
      3,
    ],
    Array [
      0,
      2,
      4,
      6,
    ],
    Array [
      0,
      3,
      6,
      9,
    ],
    Array [
      0,
      4,
      8,
      12,
    ],
  ],
  "datatype": undefined,
  "mathjs": "DenseMatrix",
  "size": Array [
    5,
    4,
  ],
}
`);
  });
});

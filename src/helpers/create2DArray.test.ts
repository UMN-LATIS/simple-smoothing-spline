import create2DArray from "./create2DArray";

describe("create2DArray", () => {
  it("should return a 2D array of zeroes", () => {
    expect(create2DArray(3, 4)).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});

// create an rows x cols array with zeros
const create2DArray = (
  rows: number,
  cols: number,
  initialValue = 0
): number[][] => {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(initialValue);
    }
    arr.push(row);
  }
  return arr;

  // return new Array(rows).map(() => new Array(cols).fill(initialValue));
};

export default create2DArray;

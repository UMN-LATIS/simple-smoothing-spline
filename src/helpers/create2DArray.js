const create2DArray = (rows, cols, initialValue = 0) => {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(initialValue);
    }
    arr.push(row);
  }
  return arr;
};
export default create2DArray;

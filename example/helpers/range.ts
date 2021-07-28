const range = (start: number, end: number) =>
  [...Array(end - start).keys()].map((i) => start + i);

export default range;

const range = (start, end) => [...Array(end - start).keys()].map((i) => start + i);
export default range;

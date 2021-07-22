import { Point } from "../types";

// given collection of {x, y} points, get all y values
const getAllYs = (pts: Point[]): number[] => pts.map((pt) => pt.y);

export default getAllYs;

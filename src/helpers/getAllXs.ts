import { Point } from "../types";

// given collection of {x, y} points, get all x values
const getAllXs = (pts: Point[]): number[] => pts.map((pt) => pt.x);

export default getAllXs;

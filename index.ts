import {
  matrix,
  transpose,
  identity,
  multiply,
  add,
  inv,
  Matrix,
} from "mathjs";

interface Point {
  x: number;
  y: number;
}

export default function smoothingSpline(
  data: Point[],
  lambda: number
): Point[] {
  return [];
}

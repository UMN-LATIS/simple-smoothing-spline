interface Point {
  x: number;
  y: number;
}

export default function smoothingSpline(
  data: Point[],
  {
    lambda,
  }?: {
    lambda?: number;
  }
): {
  fn: (x: number) => number;
  points: Point[];
};

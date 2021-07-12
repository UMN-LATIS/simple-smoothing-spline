export default class SmoothingSpline {
  constructor(collectionOfPoints) {
    this.data = collectionOfPoints;
  }

  getPoints(min, max, stepSize) {
    const f = (x) => x ** 2;
    const splinePoints = [];

    for (let i = min; i <= max; i += stepSize) {
      splinePoints.push({ x: i, y: f(i) });
    }
    return splinePoints;
  }
}

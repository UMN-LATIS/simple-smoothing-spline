import generateSmoothingSplineFunction from "./smoothingSpline/generateSmoothingSplineFunction";
import generateCubicSplineFunction from "./cubicSpline/generateCubicSplineFunction";
import getAllXs from "./helpers/getAllXs";
function generateSplinePoints(splineFn, data) {
    const splinePoints = [];
    const minX = Math.min(...getAllXs(data));
    const maxX = Math.max(...getAllXs(data));
    const stepSize = (maxX - minX) / 1000;
    for (let i = minX; i <= maxX; i += stepSize) {
        splinePoints.push({ x: i, y: splineFn(i) });
    }
    return splinePoints;
}
export default function smoothingSpline(data, { lambda = 1000, type = "smoothing" } = {}) {
    let splineFn;
    if (type === "cubic") {
        splineFn = generateCubicSplineFunction(data);
    }
    else {
        splineFn = generateSmoothingSplineFunction(data, { lambda });
    }
    const splinePoints = generateSplinePoints(splineFn, data);
    return {
        fn: splineFn,
        points: splinePoints,
    };
}
//# sourceMappingURL=index.js.map
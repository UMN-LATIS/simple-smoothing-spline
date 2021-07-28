import { Point, SplineFunction } from "../types";
export default function generateSmoothingSplineFunction(data: Point[], { lambda }: {
    lambda: number;
}): SplineFunction;

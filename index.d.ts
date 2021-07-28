import { Point } from "./types";
interface smoothingSplineOptions {
    lambda?: number;
    type?: "smoothing" | "cubic";
}
export default function smoothingSpline(data: Point[], { lambda, type }?: smoothingSplineOptions): {
    fn: (x: number) => number;
    points: {
        x: number;
        y: number;
    }[];
};
export {};

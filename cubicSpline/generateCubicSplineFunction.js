import { matrix, transpose, inv, multiply } from "mathjs";
import getAllXs from "../helpers/getAllXs";
import getAllYs from "../helpers/getAllYs";
export default (data) => {
    const xs = getAllXs(data);
    const ys = getAllYs(data);
    const basisMatrix = matrix(xs.map((x) => [1, x, Math.pow(x, 2), Math.pow(x, 3)]));
    const transposedBasisMatrix = transpose(basisMatrix);
    const Ycol = transpose(matrix(ys));
    const inverseXtX = inv(multiply(transposedBasisMatrix, basisMatrix));
    const betas = multiply(multiply(inverseXtX, transposedBasisMatrix), Ycol);
    return (x) => {
        return multiply(betas, [1, x, Math.pow(x, 2), Math.pow(x, 3)]);
    };
};
//# sourceMappingURL=generateCubicSplineFunction.js.map
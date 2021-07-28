import getAllXs from "../helpers/getAllXs";
import pos from "../helpers/pos";
import { matrix, transpose } from "mathjs";
const createBasisArray = (x, data) => [
    1,
    x,
    Math.pow(x, 2),
    Math.pow(x, 3),
    ...getAllXs(data).map((x_k) => Math.pow(pos(x - x_k), 3)),
];
export const createBasisCol = (x, data) => transpose(matrix(createBasisArray(x, data)));
export const createBasisMatrix = (data) => {
    const X = getAllXs(data).map((x) => createBasisArray(x, data));
    return matrix(X);
};
//# sourceMappingURL=createBasis.js.map
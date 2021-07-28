import { transpose, matrix, add, multiply, inv, identity, } from "mathjs";
import { createBasisMatrix } from "./createBasis";
import getAllYs from "../helpers/getAllYs";
export default function solveForBetas(data, lambda) {
    const X = createBasisMatrix(data);
    const y = transpose(matrix(getAllYs(data)));
    const Xtrans = transpose(X);
    const numOfColsOfX = X.size()[1];
    const λI = multiply(lambda, identity(numOfColsOfX));
    const inner = add(multiply(Xtrans, X), λI);
    const invInner = inv(inner);
    const betas = multiply(multiply(invInner, Xtrans), y);
    return betas;
}
//# sourceMappingURL=solveForBeta.js.map
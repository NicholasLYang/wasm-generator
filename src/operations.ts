import { Op, TypedAST, Value, isValue } from "./types";

let binOps: { [s: string]: Op; } = {
    "+ i32 i32": { oType: "i32", name: "add" },
    "- i32 i32": { oType: "i32", name: "sub" },
    "* i32 i32": { oType: "i32", name: "mul" },
    "/ i32 i32": { oType: "i32", name: "div_s" },
    "+ f32 f32": { oType: "i32", name: "add" },
    "- f32 f32": { oType: "i32", name: "sub" },
    "* f32 f32": { oType: "i32", name: "mul" },
    "/ f32 f32": { oType: "i32", name: "div_s" },
};

const getBinOp = (
    opName: string,
    arg1Type: string,
    arg2Type: string
): Op => {
    const operator = binOps[`${opName} ${arg1Type} ${arg2Type}`];
    if (operator === undefined) {
        throw new Error(
            `Operator ${opName} does not exist for types ${arg1Type} and ${arg2Type}`
        );
    }
    return operator;
}

export { binOps, getBinOp };

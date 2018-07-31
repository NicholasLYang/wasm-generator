import { readFileSync, writeFileSync } from "fs";
import { parseWat } from "wabt";
import { isValue, Param, Value, Op, Func, TypedAST } from "./types"
import { binOps } from "./operations"

let functions: { [s: string]: string; } = {
    "main": "main"
};

const literal = ({ vType, value }: Value): string => {
    return `(${vType}.const ${value})`;
}

const binOp = ({ oType, name }: Op, expr1: string, expr2: string): string => {
    return `(${oType}.${name} ${expr1} ${expr2})`;
}

const func = ({ name, params, block, returnType }: Func): string => {
    return `(func $${name} ${paramsList(params, returnType)} ${block})`
}

const loop = (block: string): string => {
    return `(loop ${block})`;
}

const exportFunc = (wasmName: string): string => {
    let jsName = functions[wasmName];
    if (jsName == undefined) {
        jsName = wasmName;
        functions[wasmName] = wasmName;
    }
    return `(export "${jsName}" (func $${wasmName}))`;
}
// Yeah yeah painter's algorithm and string concat is slow. I'll fix it later
const moduleDefs = (funcs: Func[]) => {
    let functionDefs = funcs
        .reduce(
            (acc, funcExpr) =>
                `${acc} ${func(funcExpr)}`,
            ""
        );
    let functionExports = funcs
        .reduce(
            (acc, { name }) =>
                `${acc} ${exportFunc(name)}`,
            ""
        );
    return `(module ${functionDefs} ${functionExports})`
}

const paramsList = (params: Param[], returnType: string): string => {
    let sexprParams = params.reduce(
        (acc, { pType, name }: Param) =>
            `${acc} (param $${name} ${pType})`,
        ""
    );
    return sexprParams + `(result ${returnType})`
}


const writeFile = (fileName: string, body: string) => {
    const watFile = `${fileName}.wat`;
    const mainFunc: Func = {
        name: "main",
        params: [],
        returnType: "i32",
        block: body
    };

    writeFileSync(
        watFile,
        moduleDefs([mainFunc])
    );

    const wasmModule =
        parseWat(watFile, readFileSync(watFile, "utf8"));
    const { buffer } = wasmModule.toBinary({});
    writeFileSync(`${fileName}.wasm`, Buffer.from(buffer));
}


const writeAST = (ast: TypedAST): string => {
    const { op, arg1, arg2 }: { op: Op, arg1: Value | TypedAST, arg2: Value | TypedAST }
        = ast;
    if (isValue(arg1) &&
        isValue(arg2)) {
        return binOp(op, literal(<Value>arg1), literal(<Value>arg2));
    }
    if (isValue(arg1)) {
        return binOp(op, literal(<Value>arg1), writeAST(<TypedAST>arg2));
    }
    if (isValue(arg2)) {
        return binOp(op, writeAST(<TypedAST>arg1), literal(<Value>arg2));
    }
    return binOp(op, writeAST(<TypedAST>arg1), writeAST(<TypedAST>arg2));
}

export { writeFile, writeAST };

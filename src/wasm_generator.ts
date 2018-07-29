import { readFileSync, writeFileSync } from "fs";
import { parseWat } from "wabt";

let operations: { [s: string]: Op; } = {
    "+": { oType: "i32", name: "add" },
    "-": { oType: "i32", name: "sub" },
    "*": { oType: "i32", name: "mul" },
    "/": { oType: "i32", name: "div_s" },
};

let functions: { [s: string]: string; } = {
    "main": "main"
};

interface Param {
    pType: string;
    name: string;
}

interface Value {
    vType: string;
    value: number;
}

interface Op {
    oType: string;
    name: string;
}

interface Func {
    name: string;
    params: Param[];
    block: string;
    returnType: string;
}

interface AST {
    op: string;
    arg1: Value | AST;
    arg2: Value | AST;
}

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

const isValue = (obj: AST | Value): obj is Value => {
    return (<Value>obj).vType !== undefined;
}

const writeAST = (ast: AST): string => {
    const { op, arg1, arg2 }: { op: string, arg1: Value | AST, arg2: Value | AST }
        = ast;
    if (isValue(arg1) &&
        isValue(arg2)) {
        return binOp(operations[op], literal(<Value>arg1), literal(<Value>arg2));
    }
    if (isValue(arg1)) {
        return binOp(operations[op], literal(<Value>arg1), writeAST(<AST>arg2));
    }
    if (isValue(arg2)) {
        return binOp(operations[op], writeAST(<AST>arg1), literal(<Value>arg2));
    }
    return binOp(operations[op], writeAST(<AST>arg1), writeAST(<AST>arg2));
}

export { writeFile, writeAST };

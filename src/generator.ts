import { readFileSync, writeFileSync } from "fs";
import { parseWat } from "wabt";
import { isValue, isVar, Param, Var, Value, Op, TypedFunc, TypedBinOp, TypedParseTree } from "./types"
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

const func = ({ name, params, body, returnType }: TypedFunc): string => {
    let myParams = Object.keys(params).map(key => params[key]);
    return `(func $${name} ${paramsList(myParams, returnType)} ${writeBinOp(body)})`
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
const writeFunctions = (funcs: TypedFunc[]) => {
    let functionDefs = funcs
        .reduce(
            (acc, fun) =>
                `${acc} ${func(fun)}`,
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

    writeFileSync(
        watFile,
        body
    );

    const wasmModule =
        parseWat(watFile, readFileSync(watFile, "utf8"));
    const { buffer } = wasmModule.toBinary({});
    writeFileSync(`${fileName}.wasm`, Buffer.from(buffer));
}

const writeModule = (parseTree: TypedParseTree): string => {
    return writeFunctions(parseTree.functions);
}

const variable = (myVar: Var): string => {
    return `(get_local $${myVar.name})`
}

const primary = (primary: Var | Value | TypedBinOp): string => {
    if (isValue(primary)) {
        return literal(primary);
    } else if (isVar(primary)) {
        return variable(primary);
    } else {
        return writeBinOp(primary);
    }
}

const writeBinOp = (ast: TypedBinOp): string => {
    let { op, arg1, arg2 } = ast;
    const lhs = primary(arg1);
    const rhs = primary(arg2);
    return binOp(op, lhs, rhs);
}


export { writeFile, writeModule };

import { readFileSync, writeFileSync } from "fs";
import { parseWat } from "wabt";

let functions: { [s: string]: string; } = {};

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
    let jsName = functions[wasmName];;
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


const writeFile = (fileName: string) => {
    const v1: Value = { vType: "i32", value: 100 };
    const v2: Value = { vType: "i32", value: 50 };
    const add: Op = { oType: "i32", name: "add" };
    const watFile = `${fileName}.wat`;

    const mainFunc: Func = {
        name: "main",
        params: [],
        returnType: "i32",
        block: binOp(add,
            literal(v1),
            literal(v2)
        )
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



export { writeFile };

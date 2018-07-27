const fs = require("fs");
const wabt = require("wabt");

const literal = ({ type, value }) => {
    return `(${type}.const ${value})`;
}

const binOp = ({ type, name }, expr1, expr2) => {    
    return `(${type}.${name} ${expr1} ${expr2})`;
}

const func = ({ name, params, block, returnType }) => {
    return `(func $${name} ${paramsList(params, returnType)} ${block})`
}

const exportFunc = (wasmName, jsName) => {
    return `(export "${jsName}" (func $${wasmName}))`;
}
// Yeah yeah painter's algorithm and string concat is slow. I'll fix it later
const moduleDefs = (funcs) => {
    let functionDefs = funcs
	.reduce(
	    (acc, funcExpr) =>
		`${acc} ${func(funcExpr)}`,
	    ""
	);
    let functionExports = funcs
	.reduce(
	    (acc, { name }) =>
		`${acc} ${exportFunc(name, name)}`,
	    ""
	);
    return `(module ${functionDefs} ${functionExports})`
}

const paramsList = (params, returnType) => {
    let sexprParams = params.reduce(
	(acc, { type, name }) =>
	    `${acc} (param $${name} ${type})`,
	""
    );
    return sexprParams + `(result ${returnType})`
}


const writeFile = fileName => {
    const v1 = { type: "i32", value: "100"};
    const v2 = { type: "i32", value: "50"};
    const add = { type: "i32", name: "add" };
    const watFile = `${fileName}.wat`;

    const mainFunc = {
	name: "main",
	params: [],
	returnType: "i32",
	block: binOp(add,
		     literal(v1),
		     literal(v2)
		    )    
    };

    fs.writeFileSync(
	watFile,
	moduleDefs([mainFunc])
    );

    const wasmModule =
	  wabt.parseWat(watFile, fs.readFileSync(watFile, "utf8"));
    const { buffer } = wasmModule.toBinary({});
    fs.writeFileSync(`${fileName}.wasm`, new Buffer(buffer));
}

writeFile("test");




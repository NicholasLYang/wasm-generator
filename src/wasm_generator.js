import { readFileSync, writeFileSync } from "fs";
import { parseWat } from "wabt";
var literal = function (_a) {
    var vType = _a.vType, value = _a.value;
    return "(" + vType + ".const " + value + ")";
};
var binOp = function (_a, expr1, expr2) {
    var oType = _a.oType, name = _a.name;
    return "(" + oType + "." + name + " " + expr1 + " " + expr2 + ")";
};
var func = function (_a) {
    var name = _a.name, params = _a.params, block = _a.block, returnType = _a.returnType;
    return "(func $" + name + " " + paramsList(params, returnType) + " " + block + ")";
};
var exportFunc = function (wasmName, jsName) {
    return "(export \"" + jsName + "\" (func $" + wasmName + "))";
};
// Yeah yeah painter's algorithm and string concat is slow. I'll fix it later
var moduleDefs = function (funcs) {
    var functionDefs = funcs
        .reduce(function (acc, funcExpr) {
        return acc + " " + func(funcExpr);
    }, "");
    var functionExports = funcs
        .reduce(function (acc, _a) {
        var name = _a.name;
        return acc + " " + exportFunc(name, name);
    }, "");
    return "(module " + functionDefs + " " + functionExports + ")";
};
var paramsList = function (params, returnType) {
    var sexprParams = params.reduce(function (acc, _a) {
        var pType = _a.pType, name = _a.name;
        return acc + " (param $" + name + " " + pType + ")";
    }, "");
    return sexprParams + ("(result " + returnType + ")");
};
var writeFile = function (fileName) {
    var v1 = { vType: "i32", value: 100 };
    var v2 = { vType: "i32", value: 50 };
    var add = { oType: "i32", name: "add" };
    var watFile = fileName + ".wat";
    var mainFunc = {
        name: "main",
        params: [],
        returnType: "i32",
        block: binOp(add, literal(v1), literal(v2))
    };
    writeFileSync(watFile, moduleDefs([mainFunc]));
    var wasmModule = parseWat(watFile, readFileSync(watFile, "utf8"));
    var buffer = wasmModule.toBinary({}).buffer;
    writeFileSync(fileName + ".wasm", new Buffer(buffer));
};
writeFile("test");
//# sourceMappingURL=wasm_generator.js.map
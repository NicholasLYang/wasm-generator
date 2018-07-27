const fs = require("fs");

const instantiate = async fileName => {
    const buffer = fs.readFileSync(`./${fileName}.wasm`);
    const module = await WebAssembly.compile(buffer);
    const instance = await WebAssembly.instantiate(module);
    let wasm = instance.exports;
    return wasm.main();
};

instantiate("test").then(res => console.log("RES: " + res));

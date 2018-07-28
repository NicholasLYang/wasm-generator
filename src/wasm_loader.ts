import { readFileSync } from "fs"

const instantiate = async (fileName: string) => {
    const buffer = readFileSync(`./${fileName}.wasm`);
    const module = await WebAssembly.compile(buffer);
    const instance = await WebAssembly.instantiate(module);
    let wasm = instance.exports;
    return wasm.main();
};

export { instantiate };

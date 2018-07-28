import { writeFile } from "./wasm_generator.ts";
import { instantiate } from "./wasm_loader.ts";

writeFile("test");
instantiate("test")
    .then(res => {
	console.log(res);
    })
    .catch(error => {
	console.log(error);
    });


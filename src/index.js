import { writeAST, writeFile } from "./wasm_generator.ts";
import { instantiate } from "./wasm_loader.ts";
import parser from "./expr_parser.js";
import { createInterface } from "readline"

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt(">");
rl.prompt();

rl.on("line", res => {
    let ast = parser.parse(res);
    writeFile("test", writeAST(ast));
    instantiate("test")
	.then(res => {
	    console.log(res);
	})
	.catch(error => {
	    console.log(error);
	});
}).on("close", function() {
    console.log("Exited");
    process.exit(0);
})



import { writeModule, writeFile } from "./generator.ts";
import { instantiate } from "./loader.ts";
import parser from "./expr_parser.js";
import { createInterface } from "readline"
import { checkTypes } from "./type_checker.ts"

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt(">");
rl.prompt();

rl.on("line", res => {
    let parseAst = parser.parse(res);
    let typedAST = checkTypes(parseAst);
    writeFile("test", writeModule(typedAST));
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



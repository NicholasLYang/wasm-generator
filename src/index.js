import { writeModule, writeFile } from "./generator.ts";
import { instantiate } from "./loader.ts";
import parser from "./parser.js";
import { createInterface } from "readline"
import { checkParseTree } from "./type_checker.ts"

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt(">");
rl.prompt();


rl.on("line", res => {
    let parseTree = { functions: parser.parse(res) };
    let typedParseTree = checkParseTree(parseTree);
    writeFile("test", writeModule(typedParseTree));
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



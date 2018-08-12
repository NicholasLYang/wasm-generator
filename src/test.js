const parser = require("./parser.js");

let parseTree = parser.parse(`
fun hello_world(a: Integer, b: String, c: Float) { 10 + 11 - a }
fun goodbye_world(a: Integer, b: String, c: Float) { 11 - 20 - b }
`);


console.log(parseTree);

const parser = require("./expr_parser.js");

console.log(parser.parse("fun hello(a: Integer, b: String, c: Float) { 10 + 11 }"))

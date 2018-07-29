start = additive

additive = left:multiplicative _ ("+"/"-")  _ right:additive
{ return { op: "+", arg1: left, arg2: right }; }
/ multiplicative

multiplicative = left:primary _ op:(("*"/"/"))  _ right:multiplicative
{ return { op, arg1: left, arg2: right }; }
/ primary

primary = integer
/ "(" additive:additive ")" { return additive; }

integer "integer" = digits: [0-9]+ { return { vType: "i32", value: parseInt(digits.join(""), 10) } ;}

_ "whitespace" = [ \n\r\t]*

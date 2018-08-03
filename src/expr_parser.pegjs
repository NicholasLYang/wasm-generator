start = function

function = "fun" _ fName:name "(" args:f_arglist ")" _ "{"_ block:additive _ "}"
{
 return { fName,  args, block };
}

additive = left:multiplicative _ ("+"/"-")  _ right:additive
{ return { op: "+", arg1: left, arg2: right }; }
/ multiplicative

multiplicative = left:primary _ op:(("*"/"/"))  _ right:multiplicative
{ return { op, arg1: left, arg2: right }; }
/ primary

primary =  float / integer
/ "(" additive:additive ")" { return additive; }

float "float" = [0-9]+ "." [0-9]+ { return { vType: "f32", value: parseFloat(text()) }; }

f_arglist = args:(f_arg ",")* lastArg:f_arg { let argList = args.map(arg => arg[0]); return [...argList, lastArg]; }

f_arg = _ aName:name ":" _ aType:type _ { return { aName, aType }; }

type = [A-Z][a-zA-Z]* { return text(); }

name = [a-zA-Z]* { return text(); }

integer "integer" = digits: [0-9]+ { return { vType: "i32", value: parseInt(digits.join(""), 10) } ;}

_ "whitespace" = [ \n\r\t]*

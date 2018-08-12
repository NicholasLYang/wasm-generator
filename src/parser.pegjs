start = function+

function = _ "fun" _ fName:name _ "(" args:f_arglist "):" _ returnType:type _ "{" _ body:additive _ "}" _
{
 return { name: fName,  params: args, body, returnType };
}

additive = left:multiplicative _ ("+"/"-")  _ right:additive
{ return { op: "+", arg1: left, arg2: right }; }
/ multiplicative

multiplicative = left:primary _ op:(("*"/"/"))  _ right:multiplicative
{ return { op, arg1: left, arg2: right }; }
/ primary

primary =  float / integer / n:name { return { name: n };}
/ "(" additive:additive ")" { return additive; }

float "float" = [0-9]+ "." [0-9]+ { return { vType: "f32", value: parseFloat(text()) }; }

f_call = fName:name _ "(" ")"

call_args = _ args:(name ",")* lastArg:name _
  {
    let argList = args.map(arg => arg[0]);
    return [..argList, lastArg];
  }
  
f_arglist = _ args:(f_arg ",")* lastArg:f_arg _
  {
    let argList = args.reduce((acc, arg) => ((acc[arg[0].name] = arg[0]),acc), {});
    return { ...argList, [lastArg.name]: lastArg};
  } / _ { return {}; }

f_arg = _ name:name ":" _ pType:type _ { return { name, pType }; }

type = [a-zA-Z0-9]* { return text(); }

name = [a-zA-Z_][a-zA-z_0-9]* { return text(); }

integer "integer" = digits: [0-9]+ { return { vType: "i32", value: parseInt(digits.join(""), 10) } ;}

_ "whitespace" = [ \n\r\t]*

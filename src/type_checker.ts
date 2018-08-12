import { getBinOp } from "./operations"
import {
    TypedParseTree,
    ParseTree,
    Op,
    Name,
    TypedBinOp,
    BinOp,
    ParamTable,
    TypedFunc,
    Func,
    Value,
    Var,
    isBinOp,
    isValue,
    isVar,
    isName
} from "./types"

const checkParseTree = (ast: ParseTree): TypedParseTree => {
    return {
        functions: ast.functions.map(func => (
            checkFunction(func)
        ))
    }
}

const substituteArg =
    (arg: Name | BinOp | Value, params: ParamTable): Name | BinOp | Var | Value => {
        if (isName(arg)) {
            const param = params[arg.name];
            return { name: arg.name, varType: param.pType };
        } else if (isBinOp(arg)) {
            return substituteParams(arg, params);
        }
        return arg;
    }

const substituteParams = (body: BinOp, params: ParamTable): BinOp => {
    let { arg1, arg2 } = body;
    arg1 = substituteArg(arg1, params);
    arg2 = substituteArg(arg2, params);
    return { ...body, arg1, arg2 }
}

const checkFunction = (func: Func): TypedFunc => {
    let subbedBody = substituteParams(func.body, func.params);
    const body = checkExprTypes(subbedBody);
    if (body.op.oType !== func.returnType) {
        throw TypeError(`Type of function body ${body.op.oType} does not match\
function return type ${func.returnType}`)
    }
    return { ...func, body };
}


const checkArgTypes = (arg: Value | BinOp | Var | Name): [string, Value | TypedBinOp | Var] => {
    let argType, typedArg;
    if (isValue(arg)) {
        argType = arg.vType;
        typedArg = arg;
    } else if (isBinOp(arg)) {
        typedArg = checkExprTypes(arg);
        argType = typedArg.op.oType;
    } else if (isVar(arg)) {
        typedArg = arg;
        argType = typedArg.varType;
    } else {
        console.log(arg);
        throw TypeError(`Invalid type for ${arg}`);
    }
    return [argType, typedArg];
}

const checkExprTypes = (ast: BinOp): TypedBinOp => {
    const { op, arg1, arg2 } = ast;

    let [lhsType, typedArg1] = checkArgTypes(arg1);
    let [rhsType, typedArg2] = checkArgTypes(arg2);

    let typedOp = getBinOp(op, lhsType, rhsType);

    return { op: typedOp, arg1: typedArg1, arg2: typedArg2 };
}


export { checkParseTree };

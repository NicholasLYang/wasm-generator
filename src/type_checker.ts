import { getBinOp } from "./operations"
import { Op, TypedAST, ParseAST, isValue } from "./types"

const checkTypes = (ast: ParseAST): TypedAST => {
    const { op, arg1, arg2 } = ast;
    let typedOp;
    let typedArg1;
    let typedArg2;
    if (isValue(arg1) && isValue(arg2)) {
        typedOp = getBinOp(op, arg1.vType, arg2.vType);
        typedArg1 = arg1;
        typedArg2 = arg2;
    } else if (isValue(arg1)) {
        typedArg1 = arg1;
        typedArg2 = checkTypes(<ParseAST>arg2);
        typedOp = getBinOp(op, arg1.vType, typedArg2.op.oType);
    } else if (isValue(arg2)) {
        typedArg1 = checkTypes(<ParseAST>arg1);
        typedArg2 = arg2;
        typedOp = getBinOp(op, typedArg1.op.oType, arg2.vType);
    } else {
        typedArg1 = checkTypes(<ParseAST>arg1);
        typedArg2 = checkTypes(<ParseAST>arg2);
        typedOp = getBinOp(op, typedArg1.op.oType, typedArg2.op.oType)
    }
    return { op: typedOp, arg1: typedArg1, arg2: typedArg2 };
}


export { checkTypes };

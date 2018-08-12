
export interface Param {
    pType: string;
    name: string;
}

export interface ParamTable {
    [name: string]: Param;
}

export interface Value {
    vType: string;
    value: number;
}

export interface Op {
    oType: string;
    name: string;
}

export interface Func {
    name: string;
    params: ParamTable;
    body: BinOp;
    returnType: string;
}

export interface ParseTree {
    functions: Func[];
}

export interface BinOp {
    op: string;
    arg1: Name | Value | BinOp | Var;
    arg2: Name | Value | BinOp | Var;
}

export interface TypedFunc {
    name: string;
    params: ParamTable;
    body: TypedBinOp;
    returnType: string;
}

export interface TypedBinOp {
    op: Op;
    arg1: Value | Var | TypedBinOp;
    arg2: Value | Var | TypedBinOp;
}

export interface TypedParseTree {
    functions: TypedFunc[];
}

export interface Name {
    name: string;
}

export interface Var {
    name: string;
    varType: string;
}


export const isValue = (obj: any): obj is Value => {
    return (<Value>obj).vType !== undefined;
}

export const isVar = (obj: any): obj is Var => {
    return (<Var>obj).varType !== undefined;
}

export const isTypedBinOp = (obj: any): obj is TypedBinOp => {
    return (<TypedBinOp>obj).op !== undefined;
}

export const isName = (obj: any): obj is Name => {
    return (<Name>obj).name !== undefined;
}

export const isBinOp = (obj: any): obj is BinOp => {
    return (<BinOp>obj).op !== undefined;
}


export interface Param {
    pType: string;
    name: string;
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
    params: Param[];
    body: string;
    returnType: string;
}

export interface ParseTree {
    node: Function | BinOp;
    arg1: Value | ParseTree;
    arg2: Value | ParseTree;
}

export interface BinOp {
    op: string;
    arg1: Value | BinOp;
    arg2: Value | BinOp;
}

export interface TypedBinOp {
    op: Op;
    arg1: Value | TypedBinOp;
    arg2: Value | TypedBinOp;
}

export interface TypedParseTree {
    node: Function | TypedBinOp;
    arg1: Value | TypedParseTree;
    arg2: Value | TypedParseTree;
}


export const isValue = (obj: any): obj is Value => {
    return (<Value>obj).vType !== undefined;
}

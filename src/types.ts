
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

export interface ParseAST {
    op: string;
    arg1: Value | ParseAST;
    arg2: Value | ParseAST;
}

export interface TypedAST {
    op: Op;
    arg1: Value | TypedAST;
    arg2: Value | TypedAST;
}


export const isValue = (obj: any): obj is Value => {
    return (<Value>obj).vType !== undefined;
}

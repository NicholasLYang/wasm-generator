/*
  A vague attempt to write my own parser. Will finish soon
*/
const ops = ['+', '-', '*', '/'];


const parseTokens = (toks: string[]): any => {
    const tok = toks[0];
    if (ops.includes(tok)) {
        const [arg1, rest] = parseTokens(toks);
        const [arg2, rest2] = parseTokens(rest);
        return [{
            op: tok,
            arg1,
            arg2
        }, rest2];
    }
    return [tok, toks.slice(1)];
}

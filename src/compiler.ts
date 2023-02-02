import * as S from "fp-ts/lib/State";
import { Operation } from "./model/chunk";
import { Value } from "./model/value";
import { Token, TokenType } from "./scanner";

export type State = {
    tokens: Token[],
    constants: Value[]
}
export type Output = Operation[];
type Compiler = S.State<State, Output>;

const EMPTY_STATE: State = { tokens: [], constants: [] };

const emit = (type: TokenType, op: Operation): Compiler => (state: State): [Output, State] => {
    if (state.tokens.length == 0) {
        return [[], EMPTY_STATE];
    } else {
        const [head, ...tail] = state.tokens;
        if (head.type === type)
            return [
                [op],
                { tokens: tail, constants: state.constants },
            ];
        else {
            throw new Error(`Unexpected token '${head.type}'`);
        }
    }
}


export const plus = emit(TokenType.Plus, { type: "Add" });

export const number: Compiler = (state: State): [Output, State] => {
    if (state.tokens.length == 0) {
        return [[], EMPTY_STATE];
    } else {
        const [head, ...tail] = state.tokens;
        if (head.type === TokenType.Number)
            return [
                [{ type: "Constant", id: state.constants.length }],
                { tokens: tail, constants: state.constants.concat({ type: "Number", val: head.value }) }
            ];
        else {
            throw new Error(`Unexpected token '${head.type}'`);
        }
    }
}

export const expression = (state: State): [readonly Output[], State] => {
    const actions = [number, plus, number];
    return S.sequenceArray(actions)(state);
}

export const compile = (tokens: Token[]): [readonly Output[], State] => {
    const state: State = { tokens: tokens, constants: [] };
    return expression(state);
}

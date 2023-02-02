import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { compile, Output, State } from './compiler';
import { anyOf, betweenWhitespaces, choice, many, many1, orElse, parseDigit, parseLowercase, Parser, ParseResult, pchar, pint, printResult, pstring, pword, sepBy1, sequenceP, tokenize, whitespace } from './parserLib';
import { loxParser, NumberParser, NumberToken, PlusToken, PLUS_TOKEN } from './scanner';

function expectSuccess(expectedValue: Output, result: [readonly Output[], State]) {
    expect(result).toEqual(expectedValue);
    // if (E.isLeft(result)) {
    //     const { value, remaining } = result.left;
    //     expect(value).toEqual(expectedValue);
    //     expect(remaining).toEqual(expectedRemaining);
    // } else {
    //     throw new Error(`Expected success, got: '${printResult(result)}'`);
    // }
}

function expectFailure<A, B>(found: B, result: ParseResult<A> | ParseResult<[A, A]>) {
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
        expect(printResult(result)).toContain(`Unexpected '${found}'`);
    }
}

describe('Add', () => {
    let tokens = [NumberToken(1), PLUS_TOKEN, NumberToken(2)];

    test('success', () => {
        expectSuccess([
            { type: "Constant", id: 0 },
            { type: "Add" },
            { type: "Constant", id: 1 },
        ], compile(tokens));
    });

    // test('failure', () => {
    //     expectFailure("a", parser.run("a"));
    // });

});

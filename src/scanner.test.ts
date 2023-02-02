import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { anyOf, betweenWhitespaces, choice, many, many1, orElse, parseDigit, parseLowercase, Parser, ParseResult, pchar, pint, printResult, pstring, pword, sepBy1, sequenceP, tokenize, whitespace } from './parserLib';
import { loxParser, NumberParser, NumberToken, PlusToken, PLUS_TOKEN } from './scanner';

function expectSuccess<A>(expectedValue: A, expectedRemaining: string, result: ParseResult<A>) {
    if (E.isLeft(result)) {
        const { value, remaining } = result.left;
        expect(value).toEqual(expectedValue);
        expect(remaining).toEqual(expectedRemaining);
    } else {
        throw new Error(`Expected success, got: '${printResult(result)}'`);
    }
}

function expectFailure<A, B>(found: B, result: ParseResult<A> | ParseResult<[A, A]>) {
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
        expect(printResult(result)).toContain(`Unexpected '${found}'`);
    }
}

describe('Numbers', () => {
    let parser = loxParser;

    test('success', () => {
        expectSuccess([NumberToken(1)], "", parser.run("1"));
        expectSuccess([NumberToken(1), PLUS_TOKEN, NumberToken(2)], "", parser.run("1+2"));
    });

    // test('failure', () => {
    //     expectFailure("a", parser.run("a"));
    // });

});

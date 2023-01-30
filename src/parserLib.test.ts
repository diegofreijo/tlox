import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { Parser, ParseResult, pchar } from './parserLib';

function expectSuccess<T>(expectedValue: T, expectedRemaining: string, result: ParseResult<T>) {
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
        const { value, remaining } = result.left;
        expect(value).toEqual(expectedValue);
        expect(remaining).toEqual(expectedRemaining);
    }
}

function expectFailure<T>(expected: T, found: string, result: ParseResult<T> | ParseResult<T[]>) {
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
        expect(result.right).toEqual(`Expecting '${expected}'. Got '${found}'`);
    }
}

describe('pchar', () => {

    test('success', () => {
        let res = pchar("a").run("abc");
        expectSuccess("a", "bc", res);
    });

    test('failure', () => {
        let res = pchar("a").run("bc");
        expectFailure("a", "b", res);
    });

});



describe('andThen', () => {

    test('success', () => {
        let parser = pchar("a").andThen(pchar("b"));
        let res = parser.run("abc");
        expectSuccess(["a", "b"], "c", res);
    });

    test('failure', () => {
        let parser = pchar("a").andThen(pchar("b"));
        let res = parser.run("ac");
        expectFailure("b", "c", res);
    });

});

import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { Parser, ParseResult } from './parserLib';

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
        let res = Parser.pchar("a").run("abc");
        expectSuccess("a", "bc", res);
    });

    test('failure', () => {
        let res = Parser.pchar("a").run("bc");
        expectFailure("a", "b", res);
    });

});



describe('andThen', () => {

    test('success', () => {
        let parser = Parser.pchar("a").andThen(Parser.pchar("b"));
        let res = parser.run("abc");
        expectSuccess(["a", "b"], "c", res);
    });

    test('failure', () => {
        let parser = Parser.pchar("a").andThen(Parser.pchar("b"));
        let res = parser.run("ac");
        expectFailure("b", "c", res);
    });

});


describe('orElse', () => {

    test('success 1', () => {
        let parser = Parser.pchar("a").orElse(Parser.pchar("b"));
        let res = parser.run("abc");
        expectSuccess("a", "bc", res);
    });

    test('success 2', () => {
        let parser = Parser.pchar("a").orElse(Parser.pchar("b"));
        let res = parser.run("bc");
        expectSuccess("b", "c", res);
    });

    test('failure', () => {
        let parser = Parser.pchar("a").orElse(Parser.pchar("b"));
        let res = parser.run("c");
        expectFailure("b", "c", res);
    });

});



describe('parseLowercase', () => {

    test('success 1', () => {
        let parser = Parser.parseLowercase;
        let res = parser.run("abc");
        expectSuccess("a", "bc", res);
    });

    test('success 2', () => {
        let parser = Parser.parseLowercase;
        let res = parser.run("c");
        expectSuccess("c", "", res);
    });

    test('failure', () => {
        let parser = Parser.parseLowercase;
        let res = parser.run("1abc");
        expectFailure("z", "1", res);
    });

});

describe('parseDigit', () => {

    test('success 1', () => {
        let parser = Parser.parseDigit;
        let res = parser.run("123");
        expectSuccess("1", "23", res);
    });

    test('success 2', () => {
        let parser = Parser.parseDigit;
        let res = parser.run("0");
        expectSuccess("0", "", res);
    });

    test('failure', () => {
        let parser = Parser.parseDigit;
        let res = parser.run("abc");
        expectFailure("9", "a", res);
    });

});

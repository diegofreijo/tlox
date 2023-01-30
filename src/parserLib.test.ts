import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { startsWith } from 'fp-ts/lib/string';
import { parseDigit, parseLowercase, Parser, ParseResult, pchar, sequenceP, startsWithP } from './parserLib';

function expectSuccess<A>(expectedValue: A, expectedRemaining: string, result: ParseResult<A>) {
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
        const { value, remaining } = result.left;
        expect(value).toEqual(expectedValue);
        expect(remaining).toEqual(expectedRemaining);
    }
}

function expectFailure<A>(expected: A, found: A, result: ParseResult<A> | ParseResult<[A, A]>) {
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


describe('orElse', () => {

    test('success 1', () => {
        let parser = pchar("a").orElse(pchar("b"));
        let res = parser.run("abc");
        expectSuccess("a", "bc", res);
    });

    test('success 2', () => {
        let parser = pchar("a").orElse(pchar("b"));
        let res = parser.run("bc");
        expectSuccess("b", "c", res);
    });

    test('failure', () => {
        let parser = pchar("a").orElse(pchar("b"));
        let res = parser.run("c");
        expectFailure("b", "c", res);
    });

});



describe('parseLowercase', () => {

    test('success 1', () => {
        let parser = parseLowercase;
        let res = parser.run("abc");
        expectSuccess("a", "bc", res);
    });

    test('success 2', () => {
        let parser = parseLowercase;
        let res = parser.run("c");
        expectSuccess("c", "", res);
    });

    test('failure', () => {
        let parser = parseLowercase;
        let res = parser.run("1abc");
        expectFailure("z", "1", res);
    });

});

describe('parseDigit', () => {

    test('success 1', () => {
        let parser = parseDigit;
        let res = parser.run("123");
        expectSuccess("1", "23", res);
    });

    test('success 2', () => {
        let parser = parseDigit;
        let res = parser.run("0");
        expectSuccess("0", "", res);
    });

    test('failure', () => {
        let parser = parseDigit;
        let res = parser.run("abc");
        expectFailure("9", "a", res);
    });

});

describe('sequence', () => {

    test('success 1', () => {
        let parser = sequenceP([pchar("a"), pchar("b")]);
        let res = parser.run("abc");
        expectSuccess(["a", "b"], "c", res);
    });

    test('success 2', () => {
        let parser = sequenceP([pchar("a"), pchar("b"), pchar("c")]);
        let res = parser.run("abc");
        expectSuccess(["a", "b", "c"], "", res);
    });


    test('failure', () => {
        let parser = sequenceP([pchar("a"), pchar("x"), pchar("c")]);
        let res = parser.run("abc");
        expectFailure(["x"], ["b"], res);
    });

});

import { describe, expect, test } from '@jest/globals';
import * as E from 'fp-ts/lib/Either'
import { startsWith } from 'fp-ts/lib/string';
import { betweenWhitespaces, many, many1, parseDigit, ParseLabel, parseLowercase, Parser, ParseResult, pchar, pint, printResult, pstring, sepBy, sepBy1, sequenceP, whitespace } from './parserLib';

function expectSuccess<A>(expectedValue: A, expectedRemaining: string, result: ParseResult<A>) {
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
        const { value, remaining } = result.left;
        expect(value).toEqual(expectedValue);
        expect(remaining).toEqual(expectedRemaining);
    }
}

function expectFailure<A, B>(expected: A, found: B, result: ParseResult<A> | ParseResult<[A, A]>) {
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
        // expect(printResult(result)).toEqual(`Error parsing '${label}'. Expecting '${expected}'. Got '${found}'`);
        expect(printResult(result)).toContain(`Expecting '${expected}'. Got '${found}'`);
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



describe('pstring', () => {

    test('success 1', () => {
        let parser = pstring("ab");
        let res = parser.run("abc");
        expectSuccess("ab", "c", res);
    });

    test('success 2', () => {
        let parser = pstring("abc");
        let res = parser.run("abc");
        expectSuccess("abc", "", res);
    });

    test('failure', () => {
        let parser = pstring("axc");
        let res = parser.run("abc");
        expectFailure("x", "b", res);
    });

});




describe('many', () => {

    test('success 1', () => {
        let parser = many(pchar("a"));
        let res = parser.run("aaaabc");
        expectSuccess(["a", "a", "a", "a"], "bc", res);
    });

    test('success 2', () => {
        let parser = many(pchar("a"));
        let res = parser.run("bc");
        expectSuccess([], "bc", res);
    });

    test('success 3', () => {
        let parser = many(pchar("a"));
        let res = parser.run("");
        expectSuccess([], "", res);
    });

});

describe('whitespace', () => {

    test('success 1', () => {
        let parser = whitespace;
        let res = parser.run("\t  \n    bc");
        expectSuccess(["\t", " ", " ", "\n", " ", " ", " ", " "], "bc", res);
    });

});



describe('many1', () => {

    test('success 1', () => {
        let parser = many1(pchar("a"));
        let res = parser.run("aaaabc");
        expectSuccess(["a", "a", "a", "a"], "bc", res);
    });

    test('failure', () => {
        let parser = many1(pchar("a"));
        let res = parser.run("bc");
        expectFailure(["a"], ["b"], res);
    });
});



describe('pint', () => {

    test('success 1', () => {
        let parser = pint;
        let res = parser.run("123abc");
        expectSuccess(123, "abc", res);
    });

    test('success 2', () => {
        let parser = pint;
        let res = parser.run("-123");
        expectSuccess(-123, "", res);
    });

    test('failure 1', () => {
        let parser = pint;
        let res = parser.run("abc");
        expectFailure(9, "a", res);
    });

    test('failure 2', () => {
        let parser = pint;
        let res = parser.run("-abc");
        expectFailure(9, "a", res);
    });
});


describe('betweenWhitespaces', () => {

    test('success 1', () => {
        let parser = betweenWhitespaces(pchar("a"));
        let res = parser.run("\t  \n    a  \t\n  ");
        expectSuccess("a", "", res);
    });

    test('success 2', () => {
        let parser = betweenWhitespaces(pchar("a"));
        let res = parser.run("abc");
        expectSuccess("a", "bc", res);
    });

});



describe('sepBy1', () => {

    test('success', () => {
        let parser = sepBy1(parseDigit)(pchar(","));
        expectSuccess(["1"], ",", parser.run("1,"));
        expectSuccess(["1", "2"], "", parser.run("1,2"));
        expectSuccess(["1", "2"], "", parser.run("1,2"));
        expectSuccess(["1", "2"], ",a", parser.run("1,2,a"));
    });

    test('failure', () => {
        let parser = sepBy1(parseDigit)(pchar(","));
        expectFailure(["9"], ",", parser.run(",1,"));
    });

});

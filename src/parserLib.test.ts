import { describe, expect, test } from '@jest/globals';
import { left } from 'fp-ts/lib/Either';
import { ParseResult, pchar, run } from './parserLib';

function expectSuccess<T>(value: T, remaining: string, result: ParseResult<T>) {
    expect(result._tag).toBe("Left");
    if (result._tag === "Left") {
        expect(result.left.value).toBe(value);
        expect(result.left.remaining).toBe(remaining);
    }
}

function expectFailure<T>(expected: string, found: string, result: ParseResult<T>) {
    expect(result._tag).toBe("Right");
    if (result._tag === "Right") {
        expect(result.right).toBe(`Expecting '${expected}'. Got '${found}'`);
    }
}

describe('pchar', () => {

    test('success', () => {
        let res = run(pchar("a"), "abc");
        expectSuccess("a", "bc", res);
    });

    test('failure', () => {
        let res = run(pchar("a"), "bc");
        expectFailure("a", "b", res);
    });

});

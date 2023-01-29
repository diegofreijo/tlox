import { Either } from "fp-ts/lib/Either"
import { left, right } from "fp-ts/lib/Either"
import { char } from "./model/basics"

export type ParseOutput<T> = { value: T, remaining: string };
export type ParseError = string;
export type ParseResult<T> = Either<ParseOutput<T>, ParseError>;
export type Parser<T> = (input: string) => ParseResult<T>;

export let pchar = (charToMatch: char) => {
    let innerFn = (str: string) => {
        if (!str)
            return right("No more input");
        else {
            let first = str[0];
            if (first === charToMatch) {
                let ret = { value: charToMatch, remaining: str.substring(1) };
                return left(ret);
            } else {
                return right(`Expecting '${charToMatch}'. Got '${first}'`);
            }
        }
    }

    return innerFn;
}


export function run<T>(parser: Parser<T>, input: string) {
    return parser(input)
}

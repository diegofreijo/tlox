import * as E from 'fp-ts/lib/Either'
import { char } from "./model/basics"

export type ParseOutput<T> = { value: T, remaining: string };
export type ParseError = string;
export type ParseResult<T> = E.Either<ParseOutput<T>, ParseError>;

type ParsingAction<T> = (input: string) => ParseResult<T>;
export class Parser<T> {
    action: ParsingAction<T>;

    constructor(action: ParsingAction<T>) {
        this.action = action;
    }

    public andThen(parser2: Parser<T>): Parser<T[]> {
        let innerFn = (input: string) => {
            // run parser1 with the input
            let result1 = this.run(input);
            if (E.isRight(result1))
                return result1;
            else {
                const { value: value1, remaining: remaining1 } = result1.left;

                // run parser2 with the remaining input
                let result2 = parser2.run(remaining1);
                if (E.isRight(result2))
                    return result2;
                else {
                    const { value: value2, remaining: remaining2 } = result2.left;
                    let newValue = [value1, value2];
                    return E.left({ value: newValue, remaining: remaining2 });
                }
            }
        }
        return new Parser(innerFn);
    }

    public run(input: string): ParseResult<T> {
        return this.action(input);
    }
}

export let pchar = (charToMatch: char) => {
    let innerFn = (str: string) => {
        if (!str)
            return E.right("No more input");
        else {
            let first = str[0];
            if (first === charToMatch) {
                let ret = { value: charToMatch, remaining: str.substring(1) };
                return E.left(ret);
            } else {
                return E.right(`Expecting '${charToMatch}'. Got '${first}'`);
            }
        }
    }

    return new Parser(innerFn);
}

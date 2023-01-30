import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/Functor';
import { char } from "./model/basics"

export type ParseOutput<A> = { value: A, remaining: string };
export type ParseError = string;
export type ParseResult<A> = E.Either<ParseOutput<A>, ParseError>;

type ParsingAction<A> = (input: string) => ParseResult<A>;
export class Parser<A> {
    action: ParsingAction<A>;

    constructor(action: ParsingAction<A>) {
        this.action = action;
    }


    public andThen<B>(parser2: Parser<B>): Parser<[A, B]> {
        return andThen(this, parser2);
    }

    public static orElse<A>(parser1: Parser<A>, parser2: Parser<A>): Parser<A> {
        let innerFn = (input: string) => {
            let result1 = parser1.run(input);
            if (E.isLeft(result1))
                return result1;
            else {
                let result2 = parser2.run(input);
                return result2;
            }
        }
        return new Parser(innerFn);
    }

    public orElse(parser2: Parser<A>): Parser<A> {
        return Parser.orElse(this, parser2);
    }

    public static choice<A>(listOfParsers: Parser<A>[]): Parser<A> {
        return listOfParsers.reduce(Parser.orElse);
    }


    public run(input: string): ParseResult<A> {
        return this.action(input);
    }

    public mapP<B>(mapper: (a: A) => B): Parser<B> {
        return mapP(mapper)(this);
    }
}


export const run = <A>(parser: Parser<A>) => (input: string): ParseResult<A> => parser.action(input);

export const pchar = (charToMatch: char) => {
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


export const andThen = <A, B>(parser1: Parser<A>, parser2: Parser<B>): Parser<[A, B]> => {
    let innerFn = (input: string) => {
        let result1 = parser1.run(input);
        if (E.isRight(result1))
            return result1;
        else {
            const { value: value1, remaining: remaining1 } = result1.left;
            let result2 = parser2.run(remaining1);
            if (E.isRight(result2))
                return result2;
            else {
                const { value: value2, remaining: remaining2 } = result2.left;
                let newValue: [A, B] = [value1, value2];
                return E.left({ value: newValue, remaining: remaining2 });
            }
        }
    }
    return new Parser(innerFn);
}

export const mapP = <A, B>(mapper: (a: A) => B) => (parser: Parser<A>): Parser<B> => {
    let innerFn = (input: string) => {
        let result = parser.run(input);
        if (E.isLeft(result)) {
            const { value, remaining } = result.left;
            const newValue = mapper(value);
            return E.left({ value: newValue, remaining });
        } else {
            return result;
        }
    }
    return new Parser(innerFn);
}


export const anyOf = <A>(listOfChars: char[]): Parser<char> =>
    Parser.choice(listOfChars.map(pchar));


export const parseLowercase = anyOf('abcdefghijklmnopqrstuvwxyz'.split(''));
export const parseDigit = anyOf('0123456789'.split(''));


const returnP = <A>(value: A): Parser<A> => {
    let innerFn = (input: string) => E.left({ value, remaining: input });
    return new Parser(innerFn);
}

const applyP = <A, B>(fP: Parser<(a: A) => B>) => (aP: Parser<A>): Parser<B> =>
    andThen(fP, aP).mapP(
        ([f, a]) => f(a),
    );


const lift2 = <A, B, C>(f: (a: A) => (b: B) => C) => (aP: Parser<A>) => (bP: Parser<B>): Parser<C> =>
    applyP(applyP(returnP(f))(aP))(bP);

const startsWith = (str: string) => (prefix: string) => str.startsWith(prefix);
export const startsWithP = lift2(startsWith);


export const sequenceP = <A>(parserList: Parser<A>[]): Parser<A[]> => {
    // define the "cons" function, which is a two parameter function
    let cons = <T>(head: T) => (tail: T[]) => [head, ...tail]

    // lift it to Parser World
    let consP = lift2(cons);

    if (parserList.length == 0)
        return returnP([]);
    else {
        const [head, ...tail] = parserList;
        return consP(head)(sequenceP(tail));
    }
}


/// Helper to create a string from a list of chars
const charsToStr = (charList: char[]) => charList.join('');

// match a specific string
export let pstring = (str: string) => {
    const charParsers = str.split('').map(pchar);
    return mapP(charsToStr)(sequenceP(charParsers));
}


const parseZeroOrMore = <A>(parser: Parser<A>) => (input: string): ParseOutput<A[]> => {
    const result = parser.run(input);
    const ret: ParseOutput<A[]> = E.match(
        (left: ParseOutput<A>) => {
            const { value: firstValue, remaining: inputAfterFirstParse } = left;
            let { value: subsequentValues, remaining: remainingInput } = parseZeroOrMore(parser)(inputAfterFirstParse);
            let values = [firstValue, ...subsequentValues];
            return { value: values, remaining: remainingInput };
        },
        (err: string) => { const ret: ParseOutput<A[]> = { value: [], remaining: input }; return ret; }
    )(result);
    return ret;
}

/// match zero or more occurrences of the specified parser
export const many = <A>(parser: Parser<A>) => {
    let innerFn = (input: string) =>
        E.left(parseZeroOrMore(parser)(input))

    return new Parser(innerFn)
}

const whitespaceChar = anyOf([' ', '\t', '\n']);
export const whitespace = many(whitespaceChar);

export const many1 = <A>(parser: Parser<A>): Parser<A[]> => {
    let innerFn = (input: string) => {
        return E.match(
            (output: ParseOutput<A>) => {
                const { value: firstValue, remaining: inputAfterFirstParse } = output;
                let { value: subsequentValues, remaining: remainingInput } =
                    parseZeroOrMore(parser)(inputAfterFirstParse);
                let values = [firstValue, ...subsequentValues];
                return E.left({ value: values, remaining: remainingInput });
            },
            (err: string) => E.right(err)

        )(parser.run(input));
    }

    return new Parser(innerFn)
}

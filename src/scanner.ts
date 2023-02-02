import { char } from "./model/basics";
import { betweenWhitespaces, choice, many, Parser, ParseResult, pchar, pint, tokenize } from "./parserLib";

export enum TokenType {
    // Single-character tokens.
    LeftParen, RightParen,
    LeftBrace, RightBrace,
    Comma, Dot, Minus, Plus,
    Semicolon, Slash, Star,

    // One or two character s.
    Bang, BangEqual,
    Equal, EqualEqual,
    Greater, GreaterEqual,
    Less, LessEqual,

    // Literals.
    Identifier, String, Number,

    // Keywords.
    And, Class, Else, False,
    For, Fun, If, Nil, Or,
    Print, Return, Super, This,
    True, Var, While,

    Error, Eof
}


export type Token =
    // Single-character tokens
    // LeftParen, RightParen,
    // LeftBrace, RightBrace,
    // Comma, Dot, Minus, Plus,
    | { type: TokenType.Plus }
    // Semicolon, Slash, Star,

    // One or two characters
    // Bang, BangEqual,
    // Equal, EqualEqual,
    // Greater, GreaterEqual,
    // Less, LessEqual,

    // Literals.
    // Identifier
    | { type: TokenType.Identifier, value: string }
    | { type: TokenType.Number, value: number }
    | { type: TokenType.String, value: string }
// , String, Number,

// Keywords.
// And, Class, Else, False,
// For, Fun, If, Nil, Or,
// Print, Return, Super, This,
// True, Var, While,

// Error, Eof



export const PLUS_TOKEN: Token = ({ type: TokenType.Plus });


export const PlusToken = (_value: string): Token => PLUS_TOKEN;
export const IdentifierToken = (value: string): Token => ({ type: TokenType.Identifier, value });
export const NumberToken = (value: number): Token => ({ type: TokenType.Number, value });
export const StringToken = (value: string): Token => ({ type: TokenType.String, value });



export const NumberParser: Parser<Token> = tokenize(NumberToken)(betweenWhitespaces(pint));
export const PlusParser: Parser<Token> = tokenize(PlusToken)(betweenWhitespaces(pchar('+')));
// const stringP: Parser<Token> = tokenize(strToken)(betweenWhitespaces(pword));
export const loxParser: Parser<Token[]> = many(choice([NumberParser, PlusParser]));


export function scanSource(source: string): ParseResult<Token[]> {
    return loxParser.run(source);
}

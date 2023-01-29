import { Either } from "fp-ts/lib/Either"
import { i32 } from "./model/basics"

export type TokenResult = {
    line: i32,
    token_type: TokenType,
    data: Either<Token, String>,
}

export type Token = {
    start: number,
    end: number,
    lexeme: string
}

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

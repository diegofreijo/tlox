import { char, i32, usize } from "./model/basics";
import { TokenResult } from "./token";
import { Option, some, none } from "fp-ts/lib/Option"


export class Scanner {
    source: String;
    chars: Iterator<char>;
    start: usize;
    current: usize;
    line: i32;

    constructor(source: string) {
        this.source = source;
        this.chars = source.split("")[Symbol.iterator]();
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    // public scan_token(): TokenResult {
    //     self.skip_whitespaces();
    //     self.start = self.current;
    //         match self.advance() {
    //         Some(c) => match c {
    //                 _ if Scanner:: is_alpha(c) => self.identifier(),
    //                 _ if Scanner:: is_digit(c) => self.number(),

    //                     // Single-char tokens
    //                     '(' => self.make_token(TokenType:: LeftParen),
    //                         ')' => self.make_token(TokenType:: RightParen),
    //                             '{' => self.make_token(TokenType:: LeftBrace),
    //                                 '}' => self.make_token(TokenType:: RightBrace),
    //                                     ';' => self.make_token(TokenType:: Semicolon),
    //                                         ',' => self.make_token(TokenType:: Comma),
    //                                             '.' => self.make_token(TokenType:: Dot),
    //                                                 '-' => self.make_token(TokenType:: Minus),
    //                                                     '+' => self.make_token(TokenType:: Plus),
    //                                                         '/' => self.make_token(TokenType:: Slash),
    //                                                             '*' => self.make_token(TokenType:: Star),

    //                                                                 // Two-char tokens
    //                                                                 '!' => self.make_token_if_matches(& '=', TokenType:: BangEqual, TokenType:: Bang),
    //                                                                     '=' => self.make_token_if_matches(& '=', TokenType:: EqualEqual, TokenType:: Equal),
    //                                                                         '<' => self.make_token_if_matches(& '=', TokenType:: LessEqual, TokenType:: Less),
    //                                                                             '>' => {
    //                 self.make_token_if_matches(& '=', TokenType:: GreaterEqual, TokenType:: Greater)
    //             }

    //             // String literals
    //             '"' => self.string(),

    //                 // Error
    //                 _ => self.token_error(& format!("Unexpected character '{}'", c)),
    //             },
    //         None => self.make_eof(),
    //         }
    // }

    public peek(): Option<char> {
        const ret = this.chars.next().value;
        if (ret)
            return some(ret);
        else
            return none;
    }

    // public skip_whitespaces() {
    //     while (true) {
    //         match self.peek() {
    //             Some(' ') | Some('\t') | Some('\r') => {
    //                 self.advance();
    //             }
    //             Some('\n') => {
    //                 self.line += 1;
    //                 self.advance();
    //             }
    //             Some('/') => {
    //                 if self.peek_next_matches(& '/') {
    //                     self.advance();
    //                     self.advance();
    //                     loop {
    //                         if self.peek_matches(& '\n') || self.is_eof() {
    //                             break;
    //                         } else {
    //                             self.advance();
    //                         }
    //                     }
    //                 } else {
    //                     break;
    //                 }
    //             }
    //             _ => break,
    //             }
    //         }
    //     }
}

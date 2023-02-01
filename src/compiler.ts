// import { newObjFunction, ObjFunction } from "./model/object";
// import { Scanner } from "./scanner";

// export class Compiler {
//     had_error = false;
//     panic_mode = false;

//     scanner: Scanner;
//     // previous: TokenResult:: invalid(),
//     // current: TokenResult:: invalid(),

//     // locals: [];
//     // scope_depth: 0;

//     constructor(source: string) {
//         this.scanner = new Scanner(source);
//     }

//     public compile(): ObjFunction {
//         let frame: ObjFunction = newObjFunction("main");
//         // self.advance();

//         // while !self.matches(TokenType:: Eof) {
//         //     self.declaration(& mut frame);
//         // }

//         // self.emit_return(& mut frame);

//         // #[cfg(feature = "debug_print_code")]
//         // if !ret.had_error {
//         //     ret.chunk.disassemble("code");
//         // }

//         return frame
//     }

// }

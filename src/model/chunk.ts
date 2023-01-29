import { Value } from "./value";

type IdentifierId = number;
type IdentifierName = String;
type LocalVarIndex = number;
type StackOffset = number;

export type Operation =
    { type: "Constant", id: IdentifierId } |
    { type: "Nil" } |
    { type: "True" } |
    { type: "False" } |
    { type: "Pop" } |
    { type: "GetGlobal", id: IdentifierName } |
    { type: "DefineGlobal", id: IdentifierName } |
    { type: "SetGlobal", id: IdentifierName } |
    { type: "GetLocal", id: LocalVarIndex } |
    { type: "SetLocal", id: LocalVarIndex } |
    { type: "Equal" } |
    { type: "Greater" } |
    { type: "Less" } |
    { type: "Add" } |
    { type: "Substract" } |
    { type: "Multiply" } |
    { type: "Divide" } |
    { type: "Not" } |
    { type: "Negate" } |
    { type: "Print" } |
    { type: "JumpIfFalse", offset: StackOffset } |
    { type: "Loop", offset: StackOffset } |
    { type: "Jump", offset: StackOffset } |
    { type: "Call", arguments: number } |
    { type: "Return" }

export type Chunk = {
    code: Operation[],
    constants: Value[],
    lines: number[],
}

export function newChunk(): Chunk {
    return {
        code: [],
        constants: [],
        lines: [],
    }
}

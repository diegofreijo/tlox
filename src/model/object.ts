import { Chunk, newChunk } from "./chunk"

export type ObjFunction = {
    arity: number,
    chunk: Chunk,
    name: String,
}

export function newObjFunction(name: string): ObjFunction {
    return {
        arity: 0,
        chunk: newChunk(),
        name,
    }
}

export type ObjNative = {
    name: string,
    function: () => number,
}

import { ObjFunction, ObjNative } from "./object";

export type Value =
    { type: "Nil" } |
    { type: "Boolean", val: boolean } |
    { type: "Number", val: number } |
    { type: "String", val: string } |
    { type: "Function", val: ObjFunction } |
    { type: "Native", val: ObjNative } 

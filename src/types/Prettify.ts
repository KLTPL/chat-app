import { Decimal } from "@prisma/client/runtime/library";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export default Prettify;

// 1. Define the "Leaf Types" we never want to unwrap
type Builtin = Date | Uint8Array | RegExp | Decimal;

export type ExpandRecursively<T> = T extends Builtin
  ? T // 🛑 STOP! If it's a Builtin (Date, Buffer, etc.), keep it as is. Do not unwrap.
  : T extends Array<infer U>
  ? ExpandRecursively<U>[] // 📂 ARRAY? Unwrap the array, recursively prettify the items inside, then wrap back in [].
  : T extends object
  ? { [K in keyof T]: ExpandRecursively<T[K]> } // 📦 OBJECT? Dig deep! Drill baby drill! Map over every key and recursively prettify the values inside.
  : T; // ⚪ PRIMITIVE? It's just a string, number, or boolean. Leave it alone.

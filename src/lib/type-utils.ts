export type ExtendRecursively<O, T> = O extends object
  ? T & {[K in keyof O]: ExtendRecursively<O[K], T>}
  : O

export type Await<T> = T extends PromiseLike<infer U> ? Await<U> : T

/**
 * Makes all properties required / not-nullable. Similar to Required<>, but
 * this will affect all nested properties too.
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>
}

export declare type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {
      [key in keyof T]: T[key]
    }
  ? {
      [K in keyof T]?: DeepPartial<T[K]>
    }
  : T

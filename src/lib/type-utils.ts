export type ExtendRecursively<O, T> = O extends object
  ? T & {[K in keyof O]: ExtendRecursively<O[K], T>}
  : O

export type Await<T> = T extends PromiseLike<infer U> ? Await<U> : T

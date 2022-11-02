export const isObjectOrArray = (arg: unknown): boolean => {
  return arg instanceof Object
}

export const isObject = (arg: unknown): boolean => {
  return !Array.isArray(arg) && arg instanceof Object
}

export function isDeeperThanOneNesting<T extends object>(
  object = {} as T,
): boolean {
  return Object.values(object)
    .filter(value => isObjectOrArray(value))
    .reduce((acc: T[], cur: T) => acc.concat(Object.values(cur)), [])
    .some((value: T) => isObjectOrArray(value))
}

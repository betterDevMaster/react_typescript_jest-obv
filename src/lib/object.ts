import {DeepPartial} from 'lib/type-utils'

/**
 * Will merge 2 objects by copying over values from defaults if the
 * target value's key is undefined.
 *
 * @param defaults
 * @param template
 * @returns
 */
export function withDefaults<T extends Record<string, any>>(
  defaults: T,
  template: DeepPartial<T>,
) {
  const res: any = {}

  if (!template) {
    return defaults
  }

  for (const [key, defaultValue] of Object.entries(defaults)) {
    // is {} object
    if (
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      !Array.isArray(defaultValue)
    ) {
      const hasChildProps = Object.keys(defaultValue).length > 0
      if (!hasChildProps) {
        res[key] = template[key] || {}
        continue
      }

      res[key] = withDefaults(defaultValue, template[key])
      continue
    }

    const isUndefined = template[key] === undefined
    if (isUndefined) {
      res[key] = defaultValue
      continue
    }

    // alreay set
    res[key] = template[key]
  }

  return res as T
}

export function flatten(base: Record<string, string | {} | number | null>) {
  return Object.entries(base).reduce((acc, [key, val]) => {
    const isArray = Array.isArray(val)
    const isObject = typeof val === 'object'
    const isDate = val instanceof Date
    const isRegex = val instanceof RegExp
    const isNull = val === null

    if (!isObject || isArray || isDate || isRegex || isNull) {
      acc[key] = val
      return acc
    }

    const nested = flatten(val)

    // If we're setting a blank object at the path we need to explicitly
    // set that here since it won't be handled below.
    const isEmpty = Object.keys(nested).length === 0
    if (isEmpty) {
      acc[key] = {}
      return acc
    }

    for (const [childKey, childVal] of Object.entries(nested)) {
      acc[`${key}.${childKey}`] = childVal
    }

    return acc
  }, {} as Record<string, any>)
}

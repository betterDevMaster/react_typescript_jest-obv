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
        res[key] = template[key]
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

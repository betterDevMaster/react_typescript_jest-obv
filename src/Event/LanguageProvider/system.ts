type SystemDefinitions = {
  [key: string]: string | SystemDefinitions
}

export const SYSTEM_DEFAULTS = {
  waiver: {
    submit: 'Submit',
  },
  techCheck: {
    offline: {
      title: 'Tech Check Is Currently Offline',
    },
  },
}

export function systemDefault(
  key: string,
  definitions?: SystemDefinitions,
): string | null {
  /**
   * 'key' may contain nested keys ie. waiver.submit, so we'll
   * only work with the curernt levle
   */

  const keys = key.split('.')
  const current = keys[0]
  const hasChildKeys = keys.length > 1

  const dict = definitions || SYSTEM_DEFAULTS

  const val = dict[current]

  /**
   * First check if there's anything at the specified key at all. If it's
   * undefined, let's just return null, and stop.
   */

  if (!val) {
    return null
  }

  /**
   * Found target if the value we found is actually a string, and we weren't expecting to
   * search nested keys, then that's the target value.
   */

  if (typeof val === 'string' && !hasChildKeys) {
    return val
  }

  /**
   * If we're expecting a nested key ie. waiver.submit, but waiver was actually
   * a string, then the dictionary is being incorrectly accessed, and we'll
   * return a null instead.
   */

  if (typeof val === 'string') {
    return null
  }

  /**
   * If we ran out of keys, but we're still at an object, we'll just return 'null', as
   * there's no way of knowing how to proceed.
   */

  if (!hasChildKeys) {
    return null
  }

  /**
   * Nested key is the next sequence of keys. ie. if we started with 'techCheck.main.body', the
   * nested key would be 'main.body'
   */
  const nestedKey = keys.slice(1).join('.')
  return systemDefault(nestedKey, val)
}

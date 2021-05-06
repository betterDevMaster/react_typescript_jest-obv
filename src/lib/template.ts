/**
 * Get the custom {{variables}} within a text
 *
 * @param text
 * @returns
 */

import {useCallback} from 'react'

export function parseVariables(text: string) {
  const matches = text.match(/{{([^}]+)}}/g)

  if (!matches) {
    return []
  }

  /**
   * Remove matched {{ brackes }}
   */
  return matches.map((key) => key.replace(/{/g, '').replace(/}/g, ''))
}

/**
 * Removes all {{variables}} from a given text.
 *
 * @returns
 */

export function useRemoveVariables() {
  return useCallback((text: string) => {
    const hasText = Boolean(text)
    if (!hasText) {
      return text
    }

    const variables = parseVariables(text)
    let result = text

    for (const key of variables) {
      result = replace(key, '', result)
    }

    return result
  }, [])
}

export function replace(key: string, value: string, text: string) {
  const match = new RegExp(`{{${key}}}`, 'gi')
  return text.replace(match, value)
}

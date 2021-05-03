/**
 * Get the custom {{variables}} within a text
 *
 * @param text
 * @returns
 */

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

export function replace(key: string, value: string, text: string) {
  const match = new RegExp(`{{${key}}}`, 'gi')
  return text.replace(match, value)
}

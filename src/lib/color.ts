import Color from 'color'
import ColorNames from 'color-name'

export const FALLBACK_COLOR = '#e8e8e8'

/**
 * Converts a hex (#FFFFFF) color, and an alpha (0.5), and
 * returns a rgba(255, 255, 255, 0.5) string
 *
 * @param hex
 * @param alpha
 * @returns
 */
export function rgba(hex: string, alpha: number = 1) {
  try {
    return Color(hex).alpha(alpha).rgb().string()
  } catch {
    /**
     * Provided invalid hex string, return a default
     * of white instead of blowing up.
     */
    return 'rgb(255,255,255)'
  }
}

/**
 * Determine if color is hex-color
 *
 * @param color
 * @returns @boolean
 */

export function isHexColor(color?: string) {
  if (!color || typeof color !== 'string') {
    return false
  }
  return color.search(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/g) >= 0
}

/**
 * Determine if color is valid.
 *
 * @param color
 * @returns
 */
export function isValidColor(color?: string) {
  if (!color) {
    return false
  }

  if (color in ColorNames) {
    return true
  }
  return isHexColor(color)
}

/**
 * Always returns a color string with fallback if one
 * was not provided.
 *
 * @param color
 * @returns
 */
export function safeColor(color?: string) {
  if (!color) {
    return FALLBACK_COLOR
  }

  if (isValidColor(color)) {
    return color
  }

  return FALLBACK_COLOR
}

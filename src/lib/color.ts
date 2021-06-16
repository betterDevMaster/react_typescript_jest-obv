import Color from 'color'

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

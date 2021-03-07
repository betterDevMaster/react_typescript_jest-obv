import Color from 'color'

export function rgb(hex: string, alpha: number = 1) {
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

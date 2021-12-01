import {FALLBACK_COLOR, isValidColor, safeColor} from 'lib/color'

it('should check if color is valid', () => {
  const colors = {
    blue: true,
    '#000000': true,
    foo: false,
    4: false,
  }

  for (const [color, isValid] of Object.entries(colors)) {
    expect(isValidColor(color)).toBe(isValid)
  }
})

it('should handle unsafe colors', () => {
  const invalidColors = [undefined, null, 'foo', 4]

  for (const color of invalidColors) {
    expect(safeColor(color as any)).toBe(FALLBACK_COLOR)
  }

  const validColor = '#E7E7E7'
  expect(safeColor(validColor)).toBe(validColor)
})

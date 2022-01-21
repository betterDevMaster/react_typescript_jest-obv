import {fireEvent, render} from '@testing-library/react'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

// Verify a bug where an empty value was always showing the fallback color
// (#e8e8e8)
it('should have an empty value', async () => {
  const label = 'color-picker'
  const {findByLabelText} = render(
    <ColorPicker onPick={() => {}} aria-label={label} />,
  )

  const textInput = (await findByLabelText(label)) as HTMLInputElement
  expect(textInput.value).toBe('')
})

// Verify bug fixed where manual input was broken
it('should handle manual color input', async () => {
  const label = 'color-picker'

  let selectedColor = ''

  const {findByLabelText} = render(
    <ColorPicker
      color={selectedColor}
      onPick={(color) => {
        selectedColor = color
      }}
      aria-label={label}
    />,
  )

  const textInput = (await findByLabelText(label)) as HTMLInputElement

  const updatedColor = '#ababab'

  fireEvent.change(textInput, {
    target: {
      value: updatedColor,
    },
  })

  expect(selectedColor).toBe(updatedColor)
})

it('should show invalid color error', async () => {
  const label = 'color-picker'

  const originalColor = '#ababab'
  let selectedColor = originalColor

  const {findByLabelText, findByText} = render(
    <ColorPicker
      color={selectedColor}
      onPick={(color) => {
        selectedColor = color
      }}
      aria-label={label}
    />,
  )

  const textInput = (await findByLabelText(label)) as HTMLInputElement

  const updatedColor = 'notacolor'

  fireEvent.change(textInput, {
    target: {
      value: updatedColor,
    },
  })

  expect(await findByText(/invalid color/i)).toBeInTheDocument()

  // Was not updated for invalid colors
  expect(selectedColor).toBe(originalColor)
})

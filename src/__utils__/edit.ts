import {fireEvent} from '@testing-library/react'

export function clickEdit(el: HTMLElement) {
  const editButton = el.previousSibling

  if (!editButton) {
    throw new Error('Could not find edit button')
  }

  fireEvent.click(editButton)
}

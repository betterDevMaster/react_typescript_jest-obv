import {ChangeEvent} from 'react'

export const onChangeHandler = <T>(setter: (val: T) => void) => (
  e: ChangeEvent<{value: unknown}>,
) => {
  setter(e.target.value as T)
}

export function onKeyEvent(handlers: {
  backspace?: () => any
  enter?: () => any
  metaEnter?: () => any
  shiftMetaEnter?: () => any
}) {
  return ({metaKey, keyCode, shiftKey}: React.KeyboardEvent) => {
    const pressedEnter = keyCode === 13
    const pressedBackspace = keyCode === 8

    if (shiftKey && metaKey && pressedEnter) {
      handlers.shiftMetaEnter && handlers.shiftMetaEnter()
      return
    }

    if (metaKey && pressedEnter) {
      handlers.metaEnter && handlers.metaEnter()
      return
    }

    if (pressedEnter) {
      handlers.enter && handlers.enter()
      return
    }

    if (pressedBackspace) {
      handlers.backspace && handlers.backspace()
      return
    }
  }
}

export const findWithText = (value: string | RegExp) => (
  elements: HTMLElement[],
) => {
  return elements.find((el) => {
    if (typeof value === 'string') {
      return el.textContent === value
    }

    if (!el.textContent) {
      return false
    }

    return Boolean(el.textContent.match(value))
  })
}

export const handleChangeSlider = (handler: (newValue: any) => void) => (
  event: any,
  value: number | number[],
) => {
  if (Array.isArray(value)) {
    handler(value[0])
    return
  }

  handler(value)
}

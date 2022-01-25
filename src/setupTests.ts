// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import {setWindowMatchMedia} from '__utils__/media-query'
import resizeObserver from 'resize-observer-polyfill'

// Always mock echo (sockets in test)
jest.mock('lib/sockets/echo')
jest.mock('organization/Event/EventSocketNotification')

// Increase timeout to avoid tests failing when running with coverage
// Have to move to global scope in jest v27.0 due to bug
// Issue: https://github.com/facebook/jest/issues/11543
jest.setTimeout(50000)

/**
 * Mock resize observer
 */

window.ResizeObserver = resizeObserver

beforeAll(() => {
  // Required to render <Hidden/> components in tests
  setWindowMatchMedia()
})

beforeEach(() => {
  window.localStorage.clear()

  // Allways mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {value: jest.fn(), writable: true})
  jest.clearAllMocks()
})

export const hideConsoleErrors = () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    // @ts-ignore
    console.error.mockRestore()
  })
}

export const hideConsoleWarnings = () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterAll(() => {
    // @ts-ignore
    console.warn.mockRestore()
  })
}

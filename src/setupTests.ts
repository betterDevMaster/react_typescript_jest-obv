// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import {setWindowMatchMedia} from '__utils__/media-query'
import 'jest-canvas-mock'

// Always mock echo (sockets in test)
jest.mock('lib/echo')

beforeAll(() => {
  // Required to render <Hidden/> components in tests
  setWindowMatchMedia()
  // Increase timeout to avoid tests failing when running with coverage
  jest.setTimeout(50000)
})

beforeEach(() => {
  window.localStorage.clear()

  // Allways mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {value: jest.fn(), writable: true})
  jest.clearAllMocks()
})

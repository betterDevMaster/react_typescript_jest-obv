// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import {setWindowMatchMedia} from '__utils__/media-query'
import 'jest-canvas-mock'

beforeAll(() => {
  // Required to render <Hidden/> components in tests
  setWindowMatchMedia()
})

beforeEach(() => {
  window.localStorage.clear()
})

import {useState} from 'react'

export function useToggle() {
  const [isTrue, setIsTrue] = useState(false)
  const toggle = () => setIsTrue(!isTrue)

  /**
   * Have to return an object instead of a typed array because
   * of a bug in the current CRA version (< 4.x), which
   * results in a "...map of undefined" error.
   */
  return {flag: isTrue, toggle}
}

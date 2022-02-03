import {useEffect, useRef} from 'react'

/**
 * Hook that returns the given variable's value in
 * the previous render. Useful when you need to
 * get the previous value in a useEffect.
 *
 * @param value
 * @returns
 */
export function usePrevious<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

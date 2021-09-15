import {useEffect} from 'react'

/**
 * Helper that calls the handler whenever the browser window is resized.
 *
 * @param {*} handler
 */
export function useOnResize(handler: () => void) {
  useEffect(handler, [handler])

  useEffect(() => {
    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [handler])
}

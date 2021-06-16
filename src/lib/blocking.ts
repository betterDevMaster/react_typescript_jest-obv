import {useToggle} from 'lib/toggle'
import {useCallback} from 'react'

/**
 * Decorates the given function so that only one blocking function
 * is ever run at a time.
 *
 * @param fn
 * @returns
 */
export function useBlocking() {
  const {flag: busy, toggle: toggleProcessing} = useToggle()

  const blocking = useCallback(
    <T extends any[]>(fn: (...args: T) => Promise<unknown>) => {
      return (...args: T) => {
        if (busy) {
          return Promise.reject()
        }

        toggleProcessing()

        return fn(...args).finally(toggleProcessing)
      }
    },
    [toggleProcessing, busy],
  )

  return {blocking, busy}
}

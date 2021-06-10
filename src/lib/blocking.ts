import {useToggle} from 'lib/toggle'

/**
 * Decorates the given function so that only one blocking function
 * is ever run at a time.
 *
 * @param fn
 * @returns
 */
export function useBlocking() {
  const {flag: busy, toggle: toggleProcessing} = useToggle()

  const blocking = <T extends any[]>(fn: (...args: T) => Promise<any>) => {
    return (...args: T) => {
      if (busy) {
        return
      }

      toggleProcessing()

      fn(...args).finally(toggleProcessing)
    }
  }

  return {blocking, busy}
}

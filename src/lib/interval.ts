import {useEffect, useCallback, useRef} from 'react'

export function useInterval(
  callback: () => void,
  intervalMs: number,
  shouldTerminate: boolean = false,
) {
  const isMountedRef = useRef(true)
  const timer = useRef(0)

  const update = useCallback(() => {
    if (!isMountedRef.current) {
      return
    }

    if (shouldTerminate) {
      clearInterval(timer.current)
      return
    }

    return callback()
  }, [callback, shouldTerminate])

  useEffect(() => {
    isMountedRef.current = true
    timer.current = window.setInterval(update, intervalMs)

    return () => {
      isMountedRef.current = false
      clearInterval(timer.current)
    }
  }, [update, intervalMs, timer])
}

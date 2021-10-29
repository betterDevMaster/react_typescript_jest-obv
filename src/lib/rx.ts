import {useEffect, useMemo, useState} from 'react'
import {Subject} from 'rxjs'

export function useObserve<T>(value: T) {
  const [ready, setReady] = useState(false)
  const subject = useMemo(() => new Subject<T>(), [])

  useEffect(() => {
    if (!ready) {
      return
    }

    subject.next(value)
  }, [value, ready, subject])

  const onReady = useMemo(() => {
    return ready ? null : () => setReady(true)
  }, [ready])

  return {value$: subject, onReady}
}

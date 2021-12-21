import {useEffect, useMemo, useState} from 'react'
import {Subject} from 'rxjs'
import {ajax as rxAjax} from 'rxjs/ajax'

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

/**
 * HTTP Headers to include with every request
 */
const baseAjaxHeaders = {
  'Content-Type': 'application/json', // Avoid rxjs from serializing into [object, object]
}

type AjaxOptions = {
  headers?: Record<string, string>
  accessToken?: string
}

export const ajax = {
  get(
    url: string,
    options: {
      headers?: Record<string, string>
      accessToken?: string
    } = {},
  ) {
    return rxAjax.get(url, createHeaders(options))
  },
}

function createHeaders(options: AjaxOptions) {
  const headers: Record<string, string> = {...baseAjaxHeaders}
  if (options.accessToken) {
    headers['Authorization'] = `Bearer ${options.accessToken}`
  }

  // If we have custom headers, we'll include those
  if (options.headers) {
    return {
      ...headers,
      ...options.headers,
    }
  }

  return headers
}

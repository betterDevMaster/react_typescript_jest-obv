import {Client} from 'lib/ui/api-client'
import {useToggle} from 'lib/toggle'
import {useCallback, useState} from 'react'

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
          /**
           * Should not have been called, but we'll reject
           * anyway to make sure we're always returning
           * a promise.
           */
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

/**
 * A GET request that will return back the success/error messages
 * from the server.
 *
 * @param client
 * @param url
 * @returns
 */
export function useGet(client: Client, url: string) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const send = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    setErrorMessage(null)
    setSuccessMessage(null)

    client
      .get<{
        message: string
      }>(url)
      .then((res) => {
        setSuccessMessage(res.message)
      })
      .catch((e) => {
        setErrorMessage(e.message)
      })
      .finally(toggleProcessing)
  }

  return {
    send,
    errorMessage,
    successMessage,
    processing,
  }
}

import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {ChangeEvent, useEffect, useRef} from 'react'

export const onChangeStringHandler = (setter: (v: string) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(e.currentTarget.value)
}

export const onChangeNumberHandler = (setter: (val: number) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(parseInt(e.currentTarget.value))
}

export const onUnknownChangeHandler = <T>(setter: (val: T) => void) => (
  e: ChangeEvent<{value: unknown}>,
) => {
  setter(e.target.value as T)
}

export const onChangeCheckedHandler = (setter: (val: boolean) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(e.currentTarget.checked)
}

export const handleChangeSlider = (handler: (newValue: any) => void) => (
  event: any,
  value: number | number[],
) => {
  if (Array.isArray(value)) {
    handler(value[0])
    return
  }

  handler(value)
}

export const onChangeDate = (set: (val: string) => void) => (
  date: MaterialUiPickersDate,
) => {
  const value = date?.toISOString()
  if (!value) {
    throw new Error('Missing date')
  }

  set(value)
}

export function Visible(props: {if: boolean; children: React.ReactElement}) {
  if (!props.if) {
    return null
  }

  return props.children
}

export function useIsMounted() {
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}

/**
 * Helper to only run the given function if component
 * is still mounted.
 * @returns
 */
export function useIfMounted() {
  const isMounted = useIsMounted()

  return (func: (...args: any[]) => any) => () => {
    if (!isMounted.current) {
      return
    }

    func()
  }
}

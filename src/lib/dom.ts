import {ChangeEvent, useEffect, useRef} from 'react'
import axios from 'axios'
import download from 'js-file-download'

export const onChangeStringHandler =
  (setter: (v: string) => void) =>
  (e: ChangeEvent<HTMLInputElement>): void => {
    setter(e.currentTarget.value)
  }

export const onChangeNumberHandler =
  (setter: (val: number) => void) =>
  (e: ChangeEvent<HTMLInputElement>): void => {
    setter(parseInt(e.currentTarget.value))
  }

export const onUnknownChangeHandler =
  <T>(setter: (val: T) => void) =>
  (e: ChangeEvent<{value: unknown}>) => {
    setter(e.target.value as T)
  }

export const onChangeCheckedHandler =
  (setter: (val: boolean) => void) =>
  (e: ChangeEvent<HTMLInputElement>): void => {
    setter(e.currentTarget.checked)
  }

export const handleChangeSlider =
  (handler: (newValue: any) => void) =>
  (event: any, value: number | number[]) => {
    if (Array.isArray(value)) {
      handler(value[0])
      return
    }

    handler(value)
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
 *  Download file at URL
 *
 * @param url
 * @param fileName
 */
export const downloadUrl = async (url: string, fileName: string) => {
  axios
    .get(url, {
      responseType: 'blob',
    })
    .then((response) => {
      const file = new File([response.data], fileName)
      download(file, fileName)
    })
}

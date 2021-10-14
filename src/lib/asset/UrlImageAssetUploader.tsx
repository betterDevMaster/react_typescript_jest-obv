import React from 'react'
import {parseUrl} from 'lib/url'
import ImageAssetUploader, {
  ImageAssetUploaderProps,
} from 'lib/asset/ImageAssetUploader'

type UrlImageAssetUploaderProps = Omit<ImageAssetUploaderProps, 'onChange'> & {
  onChange: (file: string) => void
}

/**
 * Simple wrapper around ImageAssetUploader that expects a css 'url()' value
 * for the image.
 *
 * @param props
 * @returns
 */
export default function UrlImageAssetUploader(
  props: UrlImageAssetUploaderProps,
) {
  const {onChange} = props
  const current = parseUrl(props.value)

  const setUrl = (file: string | null) => {
    if (!file) {
      onChange('')
      return
    }

    const updated = `url(${file})`
    onChange(updated)
  }

  return <ImageAssetUploader {...props} onChange={setUrl} value={current} />
}

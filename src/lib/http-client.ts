import download from 'js-file-download'

export interface FileLocation {
  name: string
  url: string
}

export function isFormData(obj: {}): obj is FormData {
  const name = Object.prototype.toString.call(obj)
  return name === '[object FormData]'
}

export const fetchFile = (name: string, url: string) =>
  fetch(url)
    .then((r) => r.blob())
    .then((blob) => {
      return new File([blob], name)
    })

/**
 *  Download file at URL
 *
 * @param url
 * @param name
 */
export const downloadFile = (url: string, name: string) => {
  return fetch(url)
    .then((f) => f.blob())
    .then((blob) => {
      download(blob, name)
    })
}

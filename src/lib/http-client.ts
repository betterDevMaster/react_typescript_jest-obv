export interface PublicFile {
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

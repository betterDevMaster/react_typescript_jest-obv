export const getSubdomain = (location: string) => {
  const urlParts = location.split('.')
  const missingSubdomain = urlParts.length < 3
  if (missingSubdomain) {
    return ''
  }

  const isNested = urlParts.length > 3
  if (isNested) {
    const index = urlParts.length - 3
    return urlParts[index]
  }

  return urlParts[0]
}

export const api = (path: string) => {
  const baseUrl = process.env.REACT_APP_API_URL
  return `${baseUrl}${path}`
}

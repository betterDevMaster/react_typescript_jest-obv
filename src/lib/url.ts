import {ExtendRecursively} from 'type-utils'

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

type Routes = {
  [key: string]: string | Routes
}

/**
 * Helper that automatically converts a JSON object
 * into route URLs with prependended parent
 * namespaces.
 *
 * @param routes
 * @param namespace
 */
export function createRoutes<T extends Routes>(
  routes: T,
  namespace?: string,
): ExtendRecursively<T, {root: string}> {
  const childRoutes = Object.entries(routes).reduce((acc, [key, val]) => {
    if (typeof val === 'string') {
      const prependedVal = namespace ? `/${namespace}${val}` : val
      acc[key] = prependedVal
      return acc
    }

    const prependedKey = namespace ? `${namespace}/${key}` : key
    acc[key] = createRoutes(val, prependedKey)

    return acc
  }, {} as any)

  // append root
  childRoutes.root = namespace ? `/${namespace}` : '/'

  return childRoutes
}

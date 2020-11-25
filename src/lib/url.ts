import {isStaging} from 'App'
import {ExtendRecursively} from 'lib/type-utils'

export const getSubdomain = (location: string) => {
  const urlParts = location.split('.')
  const missingSubdomain = urlParts.length < 3
  if (missingSubdomain) {
    return ''
  }

  const hasNestedSubdomains = urlParts.length > 3
  if (!hasNestedSubdomains) {
    return urlParts[0]
  }

  const index = urlParts.length - 3
  const firstSubdomain = urlParts[index]
  const isStaging = firstSubdomain === 'staging'
  if (isStaging) {
    // return next child to allow app.staging.obv.io
    return urlParts[index - 1]
  }

  return firstSubdomain
}

export const api = (path: string) => {
  const baseUrl = process.env.REACT_APP_API_URL
  return `${baseUrl}${path}`
}

export const publicAsset = (path: string) => {
  const prodBucket = 'https://obvio-platform-public.s3.us-east-2.amazonaws.com'
  const stagingBucket =
    'https://obvio-platform-public-staging.s3.us-east-2.amazonaws.com'

  const base = isStaging ? stagingBucket : prodBucket
  return `${base}/${path}`
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

export function routesWithValue<T>(param: string, value: string, routes: T): T {
  return Object.entries(routes).reduce((acc, [key, route]) => {
    if (typeof route === 'string') {
      const withParam = route.replace(param, value)
      acc[key] = withParam
      return acc
    }

    acc[key] = routesWithValue(param, value, route)
    return acc
  }, {} as any)
}

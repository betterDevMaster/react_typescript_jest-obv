import {useVariables} from 'Event'
import {storage} from 'lib/url'

/**
 * Returns the URL for a given resource.
 *
 * @param resource
 * @returns
 */
export function useResourceUrl(resource: {
  url?: string
  filePath: string
}): string {
  const v = useVariables()
  if (resource.url) {
    return v(resource.url)
  }

  return storage(`/event/resources/${resource.filePath}`)
}

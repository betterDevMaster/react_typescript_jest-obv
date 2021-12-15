import {useAttendeeVariables} from 'Event'
import {storage} from 'lib/url'

/**
 * Returns the URL for a given resource.
 *
 * @param resource
 * @returns
 */
export function useResourceUrl(resource: {
  isUrl?: boolean
  url?: string
  filePath: string
}): string {
  const v = useAttendeeVariables()
  if (resource.isUrl) {
    return v(resource.url)
  }

  return storage(`/event/resources/${resource.filePath}`)
}

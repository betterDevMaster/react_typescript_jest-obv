import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

export interface InfusionsoftTag {
  name: string
  id: number
}

export function useAddTag() {
  const {client, event} = useEvent()

  const url = api(`/events/${event.slug}/integrations/infusionsoft/add_tag`)
  return (tag: InfusionsoftTag) => {
    try {
      client.post(url, {
        id: tag.id,
      })
    } catch {
      // Ignore errors, failing to add a tag should
      // not break the app.
    }
  }
}

import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

export type ZapierTag = string

export function useAddTag() {
  const {client, event} = useEvent()

  const url = api(`/events/${event.slug}/integrations/zapier/add_tag`)
  return (tag: ZapierTag) => {
    try {
      client.post(url, {
        name: tag,
      })
    } catch {
      // Ignore errors, failing to add a tag should
      // not break the app.
    }
  }
}

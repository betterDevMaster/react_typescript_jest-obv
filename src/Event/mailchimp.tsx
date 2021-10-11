import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

export type MailchimpTag = string

export function useAddTag() {
  const {client} = useEvent()

  const url = api('/tags/mailchimp')
  return (tag: MailchimpTag) => {
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

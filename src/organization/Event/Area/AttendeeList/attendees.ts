import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAttendees} from 'organization/Event/AttendeeManagement/attendees'
import {useOrganization} from 'organization/OrganizationProvider'

export function useAreaAttendees() {
  const {area} = useArea()
  const {client} = useOrganization()
  const {event} = useEvent()
  const list = useAttendees(area)

  const add = (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/attendees/${attendee.id}`,
    )
    return client.post(url).then(() => {
      list.insert(attendee)
    })
  }

  const remove = (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/attendees/${attendee.id}`,
    )
    return client.delete(url).then(() => {
      list.remove(attendee)
    })
  }
  return {
    ...list,
    add,
    remove,
  }
}

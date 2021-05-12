import {useTrackOnLoad} from 'analytics'
import {setUser} from 'auth/actions'
import {Attendee} from 'Event/attendee'
import {useAttendee} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'

export default function SelfCheckIn() {
  const {client} = useEvent()
  const dispatch = useDispatch()
  const attendee = useAttendee()
  const {event} = useEvent()

  useTrackOnLoad({
    category: 'Event',
    action: 'Visit Self Check-In',
    label: event.name,
  })

  useEffect(() => {
    const url = api(`/check_in`)
    client.put<Attendee>(url, {}).then((attendee) => {
      dispatch(setUser(attendee))
    })
  }, [client, dispatch])

  const hasCheckedIn = Boolean(attendee.tech_check_completed_at)
  if (hasCheckedIn) {
    return <Redirect to={eventRoutes.root} />
  }

  return <FullPageLoader />
}

import {useTrackEventPage} from 'analytics'
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

  useTrackEventPage({
    page: 'Visit Self Check-In',
  })

  useEffect(() => {
    const url = api('/self_tech_check')
    client.put<Attendee>(url).then((attendee) => {
      dispatch(setUser(attendee))
    })
  }, [client, dispatch])

  if (attendee.has_completed_tech_check) {
    return <Redirect to={eventRoutes.root} />
  }

  return <FullPageLoader />
}

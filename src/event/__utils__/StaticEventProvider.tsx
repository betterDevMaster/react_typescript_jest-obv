import {ObvioEvent} from 'event'
import {setEvent} from 'event/state/actions'
import {EventContext} from 'organization/Events/EventProvider'
import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'

export default function StaticEventProvider(props: {
  event: ObvioEvent
  children: React.ReactNode
}) {
  const {event} = props
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEvent(event))
  }, [event, dispatch])

  return (
    <EventContext.Provider value={event}>
      {props.children}
    </EventContext.Provider>
  )
}

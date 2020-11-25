import {setEvent} from 'Event/state/actions'
import {EventContext} from 'Event/EventProvider'
import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {ObvioEvent} from 'Event'

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

import {setEvent} from 'Event/state/actions'
import {EventContext, hasTechCheck} from 'Event/EventProvider'
import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ObvioEvent} from 'Event'
import {eventClient} from 'Event/api-client'
import {RootState} from 'store'

export default function StaticEventProvider(props: {
  event: ObvioEvent
  children: React.ReactNode
}) {
  const {event} = props
  const dispatch = useDispatch()
  const current = useSelector((state: RootState) => state.event)

  useEffect(() => {
    dispatch(setEvent(event))
  }, [event, dispatch])

  const update = useCallback(
    (updated: ObvioEvent) => {
      dispatch(setEvent(updated))
    },
    [dispatch],
  )

  return (
    <EventContext.Provider
      value={{
        event: current || event,
        client: eventClient,
        hasTechCheck: hasTechCheck(event),
        update,
      }}
    >
      {props.children}
    </EventContext.Provider>
  )
}

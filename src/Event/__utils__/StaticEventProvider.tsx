import {setEvent} from 'Event/state/actions'
import {EventContext, hasTechCheck, hasWaiver} from 'Event/EventProvider'
import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ObvioEvent} from 'Event'
import {eventClient} from 'Event/api-client'
import {RootState} from 'store'
import {appRoot, isProduction} from 'env'

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

  const set = useCallback(
    (updated: ObvioEvent) => {
      dispatch(setEvent(updated))
    },
    [dispatch],
  )

  if (!current) {
    return null
  }

  const scheme = isProduction ? 'https://' : 'http://'
  const url = `${scheme}${current.slug}.${appRoot}`

  return (
    <EventContext.Provider
      value={{
        event: current,
        client: eventClient,
        hasTechCheck: hasTechCheck(event),
        hasWaiver: hasWaiver(event),
        set,
        url,
      }}
    >
      {props.children}
    </EventContext.Provider>
  )
}

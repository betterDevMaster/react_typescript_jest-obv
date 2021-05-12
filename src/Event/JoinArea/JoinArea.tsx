import {useEvent, useJoinUrl} from 'Event/EventProvider'
import React, {useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import OfflinePage from 'Event/JoinArea/OfflinePage'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {sendTiming, useTrackOnLoad} from 'analytics'

export default function JoinArea() {
  const {area: areaKey} = useParams<{area: string}>()
  const {joinUrl, error} = useJoinUrl(areaKey)
  const {event} = useEvent()
  const startTime = useRef<number>(Date.now())

  useTrackOnLoad({
    category: 'Event',
    action: 'Joined Meeting',
    label: event.name,
  })

  useEffect(() => {
    if (!joinUrl) {
      return
    }

    const now = Date.now()
    const duration = now - startTime.current
    sendTiming({
      category: 'Event',
      variable: 'Wait Time to Join Meeting',
      value: duration,
      label: event.name,
    })

    window.location.href = joinUrl
  }, [joinUrl, event])

  if (error) {
    return <OfflinePage error={error} />
  }

  return <FullPageLoader />
}

import {useJoinUrl} from 'Event/EventProvider'
import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import OfflinePage from 'Event/JoinArea/OfflinePage'

export default function JoinArea() {
  const {area: routeId} = useParams<{area: string}>()
  const id = parseInt(routeId)
  const {joinUrl, error} = useJoinUrl(id)

  useEffect(() => {
    if (!joinUrl) {
      return
    }

    window.location.href = joinUrl
  }, [joinUrl])

  if (error) {
    return <OfflinePage error={error} />
  }

  return <div>loading...</div>
}

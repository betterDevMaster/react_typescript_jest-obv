import {useJoinUrl} from 'Event/EventProvider'
import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import OfflinePage from 'Event/JoinArea/OfflinePage'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'

export default function JoinArea() {
  const {area: areaKey} = useParams<{area: string}>()
  const {joinUrl, error} = useJoinUrl(areaKey)

  useEffect(() => {
    if (!joinUrl) {
      return
    }

    window.location.href = joinUrl
  }, [joinUrl])

  if (error) {
    return <OfflinePage error={error} />
  }

  return <FullPageLoader />
}

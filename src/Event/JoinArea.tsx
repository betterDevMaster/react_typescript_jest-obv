import {RequestJoinUrlError, useJoinUrl} from 'Event/EventProvider'
import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Center from 'lib/ui/layout/Center'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const FALLBACK_OFFLINE_TITLE = 'Area is currently offline'

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

function OfflinePage(props: {error: RequestJoinUrlError}) {
  const {error} = props

  const title = error.offline_title || FALLBACK_OFFLINE_TITLE
  const description = error.offline_description || ''

  return (
    <Center>
      <Box p={5}>
        <Typography variant="h4" align="center">
          {title}
        </Typography>
        <Typography align="center">{description}</Typography>
      </Box>
    </Center>
  )
}

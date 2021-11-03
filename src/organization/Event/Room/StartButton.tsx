import Button from '@material-ui/core/Button'
import {useIsMounted} from 'lib/dom'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

export default function StartButton(props: {processing: boolean}) {
  const {room} = useRoom()
  const [url, setUrl] = useState<string | null>(null)
  const {client} = useOrganization()
  const isMounted = useIsMounted()
  const canStart = useCanStart(props.processing, url)

  useEffect(() => {
    if (!room.is_online) {
      return
    }

    setUrl(null)
    const startUrl = api(`/rooms/${room.id}/start_url`)

    client.get<{url: string}>(startUrl).then(({url}) => {
      if (!isMounted.current) {
        return
      }

      setUrl(url)
    })
  }, [client, room, isMounted])

  return (
    <AbsoluteLink to={url || ''} newTab disableStyles disabled={!canStart}>
      <Button
        variant="contained"
        color="primary"
        aria-label="start room"
        disabled={!canStart}
      >
        Start
      </Button>
    </AbsoluteLink>
  )
}

/**
 * Whether a host is able to start a room.
 *
 * @param processing
 * @param url
 * @returns
 */
function useCanStart(processing: boolean, url: string | null) {
  const {room} = useRoom()

  if (processing) {
    return false
  }

  return Boolean(url) && room.is_online
}

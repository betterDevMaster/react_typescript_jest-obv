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

  const canStart = Boolean(url) && room.is_online && !props.processing

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

  const button = (
    <Button
      variant="contained"
      color="primary"
      aria-label="start room"
      disabled={!canStart}
    >
      Start
    </Button>
  )

  if (!url) {
    return button
  }

  return (
    <AbsoluteLink to={url} newTab disableStyles disabled={!canStart}>
      {button}
    </AbsoluteLink>
  )
}

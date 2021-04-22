import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {useIsMounted} from 'lib/dom'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

export default function StartButton(props: {processing: boolean}) {
  const {room} = useRoom()
  const {event} = useEvent()
  const {area} = useArea()
  const [url, setUrl] = useState<string | null>(null)
  const {client} = useOrganization()
  const isMounted = useIsMounted()

  const canStart = Boolean(url) && room.is_online && !props.processing

  useEffect(() => {
    if (!room.is_online) {
      return
    }

    setUrl(null)
    const startUrl = api(
      `/events/${event.slug}/areas/${area.id}/rooms/${room.id}/start_url`,
    )

    client.get<{url: string}>(startUrl).then(({url}) => {
      if (!isMounted.current) {
        return
      }

      setUrl(url)
    })
  }, [area, client, event, room, isMounted])

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

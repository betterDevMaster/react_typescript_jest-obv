import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {useIsMounted} from 'lib/dom'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

const TEST_MODE_HELP_ARTICLE_URL = 'https://help.obv.io/test-mode/'

export default function StartButton(props: {processing: boolean}) {
  const {room} = useRoom()
  const [url, setUrl] = useState<string | null>(null)
  const {client} = useOrganization()
  const isMounted = useIsMounted()
  const canStart = useCanStart(props.processing, url)
  const {event} = useEvent()

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

  const launchRoom = () => {
    if (!url) {
      return
    }

    // open room in new tab
    window.open(url, '_blank')?.focus()
  }

  return (
    <ConfirmDialog
      onConfirm={launchRoom}
      title="Your Event Has Not Started"
      description={
        <div>
          Because your event has not yet started, this Room is being launched in
          TEST MODE. It will be automatically ended in 60 minutes. To learn more
          about TEST MODE, click{' '}
          <AbsoluteLink to={TEST_MODE_HELP_ARTICLE_URL} newTab>
            here
          </AbsoluteLink>
          .
        </div>
      }
      confirmLabel="Start"
      variant="info"
      // If an event is live we are NOT in test mode, so we'll
      // skip the confirmation
      skip={event.is_live}
    >
      {(confirm) => (
        <Button
          variant="contained"
          color="primary"
          aria-label="start room"
          disabled={!canStart}
          onClick={confirm}
        >
          Start
        </Button>
      )}
    </ConfirmDialog>
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

import Button from '@material-ui/core/Button'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React from 'react'

export default function EndButton(props: {
  processing: boolean
  numAttendees?: number
}) {
  const {room, endMeeting, processing} = useRoom()

  const canEndMeeting =
    props.numAttendees !== 0 && !processing && room.is_online

  return (
    <ConfirmDialog
      onConfirm={endMeeting}
      title="End meeting"
      description={
        <div>
          The action will end the Zoom meeting in progress. Are you sure you
          wish to end this meeting, and remove all participants from the
          meeting?
        </div>
      }
      confirmLabel="Yes"
      variant="info"
    >
      {(confirm) => (
        <Button
          variant="contained"
          color="primary"
          aria-label="end meeting"
          disabled={!canEndMeeting}
          onClick={confirm}
        >
          End meeting
        </Button>
      )}
    </ConfirmDialog>
  )
}

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useEvent} from 'Event/EventProvider'
import Dialog from 'lib/ui/Dialog'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React, {useEffect, useState} from 'react'

const HELP_ARTICLE_URL = 'https://help.obv.io/test-mode/'

export default function TestModeNoticeDialog() {
  const {
    event: {has_paid},
  } = useEvent()

  const {
    room: {is_online},
  } = useRoom()

  const [showing, setShowing] = useState(false)

  const closeDialog = () => setShowing(false)

  useEffect(() => {
    const isTestMode = !has_paid && is_online

    setShowing(isTestMode)
  }, [is_online, has_paid])

  return (
    <Dialog open={showing} onClose={closeDialog}>
      <DialogTitle>Your Event Has Not Started</DialogTitle>
      <DialogContent>
        Because your event has not yet started, this Room is being launched in
        TEST MODE. It will be automatically ended in 60 minutes. To learn more
        about TEST MODE, click{' '}
        <AbsoluteLink to={HELP_ARTICLE_URL} newTab>
          here
        </AbsoluteLink>
        .
      </DialogContent>
      <Box pt={2} pb={3} textAlign="center">
        <Button color="primary" variant="contained" onClick={closeDialog}>
          OK
        </Button>
      </Box>
    </Dialog>
  )
}

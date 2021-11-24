import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import {useIsConnected} from 'Event/Dashboard/editor/state/edit-mode'
import Button from 'lib/ui/Button'
import Dialog from 'lib/ui/Dialog'
import React from 'react'

export default function DisconnectedDialog() {
  const isConnected = useIsConnected()

  const refresh = () => window.location.reload()

  if (isConnected) {
    return null
  }

  return (
    <Dialog open fullWidth>
      <DialogContent>
        <Box py={5}>
          <Box mb={2}>
            <Typography align="center" variant="h5">
              Network Connection Error!
            </Typography>
          </Box>
          It looks like we're having trouble connecting to the Obvio servers.
          Your last edit may not have saved. Click{' '}
          <Button variant="text" onClick={refresh}>
            HERE
          </Button>{' '}
          reconnect to Obvio servers, and try again.
        </Box>
      </DialogContent>
    </Dialog>
  )
}

import React from 'react'
import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import LeaderboardConfig from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'

export default function LeaderboardSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props

  return (
    <Dialog open={visible} onClose={onClose} fullWidth>
      <DialogTitle>Leaderboard Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <LeaderboardConfig onComplete={onClose} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

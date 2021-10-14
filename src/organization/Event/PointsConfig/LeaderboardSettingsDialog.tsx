import React from 'react'
import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import SimpleBlogLeaderboardConfig from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'
import PanelsLeaderboardConfig from 'Event/template/Panels/Dashboard/Leaderboard/LeaderboardConfig'
import CardsLeaderboardConfig from 'Event/template/Cards/Leaderboard/LeaderboardConfig'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'

export type LeaderboardConfigProps = {onComplete: () => void}

export default function LeaderboardSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return (
        <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
          <DialogTitle>Leaderboard Page</DialogTitle>
          <DialogContent>
            <Box pb={2}>
              <SimpleBlogLeaderboardConfig onComplete={onClose} />
            </Box>
          </DialogContent>
        </Dialog>
      )
    case PANELS:
      return <PanelsLeaderboardConfig isVisible={visible} onClose={onClose} />
    case CARDS:
      return <CardsLeaderboardConfig isVisible={visible} onClose={onClose} />
  }
}

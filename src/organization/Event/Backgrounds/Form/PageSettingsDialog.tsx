import React, {useState} from 'react'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Zoom Background</DialogTitle>
      <DialogContent>
        <Box pb={2}>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
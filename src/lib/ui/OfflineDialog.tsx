import React from 'react'
import Dialog from 'lib/ui/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

export default function OfflineDialog(props: {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
}) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="offline dialog box"
    >
      <>
        <DialogTitle>{props.title}</DialogTitle>
        <Description>{props.description}</Description>
      </>
    </Dialog>
  )
}

function Description(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <DialogContent>{props.children}</DialogContent>
}

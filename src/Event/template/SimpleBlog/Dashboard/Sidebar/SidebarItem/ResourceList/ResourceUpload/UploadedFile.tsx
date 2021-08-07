import React from 'react'
import {storage} from 'lib/url'
import DangerButton from 'lib/ui/Button/DangerButton'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import Button from '@material-ui/core/Button'

export default function ExistingFile(props: {
  filePath: string
  onRemove: () => void
}) {
  if (!props.filePath) {
    return null
  }

  const path = storage(`/event/resources/${props.filePath}`)

  return (
    <>
      <AbsoluteLink to={path} disableStyles newTab>
        <Button variant="outlined" color="primary">
          View Uploaded File
        </Button>
      </AbsoluteLink>
      <DangerButton
        onClick={props.onRemove}
        variant="outlined"
        aria-label="remove resource file"
      >
        Remove File
      </DangerButton>
    </>
  )
}

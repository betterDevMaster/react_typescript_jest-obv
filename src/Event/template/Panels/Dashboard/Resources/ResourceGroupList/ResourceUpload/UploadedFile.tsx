import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import Button from '@material-ui/core/Button'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItem'
import {storage} from 'lib/url'

export default function UploadedFile(props: {
  resource: Resource
  onRemoveFile: (resource: Resource) => void
}) {
  if (!props.resource.filePath) {
    return null
  }

  const remove = () => props.onRemoveFile(props.resource)
  const path = storage(`/event/resources/${props.resource.filePath}`)

  return (
    <>
      <AbsoluteLink to={path} disableStyles newTab>
        <Button variant="outlined" color="primary">
          View Uploaded File
        </Button>
      </AbsoluteLink>
      <DangerButton
        onClick={remove}
        variant="outlined"
        aria-label="remove resource file"
      >
        Remove File
      </DangerButton>
    </>
  )
}

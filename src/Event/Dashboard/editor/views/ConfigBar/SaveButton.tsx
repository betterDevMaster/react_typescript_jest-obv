import React from 'react'
import Button from '@material-ui/core/Button'
import {useSaveTemplate} from 'organization/Event/template'

export default function SaveButton() {
  const {save, processing} = useSaveTemplate()

  return (
    <Button
      disabled={processing}
      color="primary"
      variant="contained"
      onClick={save}
      size="small"
      aria-label="save dashboard"
    >
      Save
    </Button>
  )
}

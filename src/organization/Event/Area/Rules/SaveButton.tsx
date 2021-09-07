import Button from '@material-ui/core/Button'
import {useRules} from 'organization/Event/Area/Rules/RulesProvider'
import React from 'react'

export default function SaveButton() {
  const {save, processing} = useRules()

  return (
    <Button
      variant="contained"
      color="primary"
      aria-label="save"
      disabled={processing}
      onClick={save}
    >
      Save
    </Button>
  )
}

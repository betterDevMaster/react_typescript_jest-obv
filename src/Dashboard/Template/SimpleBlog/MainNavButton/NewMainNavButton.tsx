import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React from 'react'

export default function NewMainNavButton(props: {isEditMode: boolean}) {
  if (!props.isEditMode) {
    return null
  }

  return (
    <Grid item xs={12}>
      <Button fullWidth size="large" variant="outlined" color="primary">
        New Button
      </Button>
    </Grid>
  )
}

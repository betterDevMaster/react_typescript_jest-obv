import Button, {ButtonProps} from '@material-ui/core/Button'
import React from 'react'

export default function AddButton(props: ButtonProps) {
  return (
    <Button {...props} variant="contained" color="primary">
      Add additional waiver
    </Button>
  )
}

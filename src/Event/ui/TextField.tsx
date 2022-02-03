import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import PasswordField from 'lib/ui/TextField/PasswordField'
import {useTheme} from 'styled-components'

export default function TextField(
  props: TextFieldProps & {
    borderRadius?: number
  },
) {
  const {borderRadius = 56} = props

  const theme = useTheme()

  const useStyles = makeStyles({
    root: {
      backgroundColor: `${theme.colors.input.background} !important`,
      borderRadius: `${borderRadius}px !important`,
      '& .MuiFilledInput-input': {
        borderRadius: `${borderRadius}px !important`,
      },
      '&::before': {
        content: 'unset',
      },
      '&::after': {
        content: 'unset',
      },
    },
  })

  const classes = useStyles()

  const Field = props.type === 'password' ? PasswordField : MuiTextField

  return (
    <Field
      {...props}
      variant="filled"
      InputProps={{
        classes: {
          root: classes.root,
        },
      }}
    />
  )
}

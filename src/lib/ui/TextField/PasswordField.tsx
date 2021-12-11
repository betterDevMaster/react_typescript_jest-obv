import InputAdornment from '@material-ui/core/InputAdornment'
import styled from 'styled-components'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import {Icon} from 'lib/fontawesome/Icon'
import {useToggle} from 'lib/toggle'
import IconButton from 'lib/ui/IconButton'
import {colors} from 'lib/ui/theme'
import React from 'react'

export default function PasswordField(props: Omit<TextFieldProps, 'type'>) {
  const {flag: showingPlainText, toggle: togglePlainText} = useToggle()

  const type = showingPlainText ? 'text' : 'password'

  return (
    <TextField
      {...props}
      type={type}
      InputProps={{
        ...(props.InputProps || {}),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={togglePlainText}
              aria-label="toggle show password"
            >
              <EyeIcon iconClass={'far fa-eye'} color={colors.primary} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

const EyeIcon = styled(Icon)`
  margin-right: 10px;
`

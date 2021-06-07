import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import IconButton from 'lib/ui/IconButton'
import {grey} from '@material-ui/core/colors'
import MuiDialog, {DialogProps} from '@material-ui/core/Dialog'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default function Dialog(
  props: {
    children: React.ReactElement | React.ReactElement[]
    open: boolean
    onClose: () => void
  } & DialogProps,
) {
  return (
    // Always use light-mode theme to avoid the dialog
    // from inheriting the Event's dark mode.
    <ThemeProvider>
      <MuiDialog
        open={props.open}
        onClose={props.onClose}
        fullWidth={props.fullWidth}
        disableEnforceFocus={props.disableEnforceFocus}
      >
        <CloseButton onClick={props.onClose} aria-label="close dialog">
          <CloseIcon fontSize="small" />
        </CloseButton>
        <>{props.children}</>
      </MuiDialog>
    </ThemeProvider>
  )
}

const CloseButton = styled(IconButton)`
  position: absolute;
  top: ${(props) => props.theme.spacing[2]};
  right: ${(props) => props.theme.spacing[2]};

  svg {
    color: ${grey[500]};
  }
`

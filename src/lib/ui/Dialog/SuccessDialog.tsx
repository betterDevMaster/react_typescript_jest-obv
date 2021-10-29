import DialogContent from '@material-ui/core/DialogContent'
import {faCheckCircle} from '@fortawesome/pro-solid-svg-icons'
import Typography from '@material-ui/core/Typography'
import Dialog from 'lib/ui/Dialog'
import {colors} from 'lib/ui/theme'
import Box from '@material-ui/core/Box'
import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

export default function SuccessDialog(props: {
  showing: boolean
  onClose: () => void
  children: string
}) {
  return (
    <Dialog open={props.showing} onClose={props.onClose}>
      <DialogContent dividers>
        <Box py={4} px={9}>
          <Typography align="center" variant="h5">
            {props.children}
          </Typography>
        </Box>
        <Box textAlign="center">
          <CheckIcon icon={faCheckCircle} color={colors.success} />
        </Box>
      </DialogContent>
      <CenteredActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
      </CenteredActions>
    </Dialog>
  )
}

const CenteredActions = withStyles({
  root: {
    justifyContent: 'center',
  },
})(DialogActions)

const CheckIcon = styled(FontAwesomeIcon)`
  font-size: 38px;
`

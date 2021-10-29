import Dialog from '@material-ui/core/Dialog'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import {Icon} from 'lib/fontawesome/Icon'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {obvioRoutes} from 'obvio/Routes'

export type CreditsError = {
  type: 'insufficient_credits'
  credits_short: number
}

export default function InsufficientCreditsPopup(props: {
  error?: any
  onDismiss: () => void
}) {
  const {error, onDismiss} = props

  const creditLabel = (num: number) => (num > 1 ? 'credits' : 'credit')

  if (!error || !isCreditsError(error)) {
    return null
  }

  return (
    <Dialog open={true} onClose={onDismiss}>
      <DialogContent>
        <Box>
          <Icon className="sad-tear" />
          <CreditsNeeded>Not Enough Credits</CreditsNeeded>
          <Typography>
            Add{' '}
            <strong>{`${error.credits_short} ${creditLabel(
              error.credits_short,
            )}`}</strong>{' '}
            to complete the request.
          </Typography>
          <AddCreditsBox>
            <RelativeLink to={obvioRoutes.billing.root} disableStyles>
              <Button variant="contained" color="primary">
                Add Credits
              </Button>
            </RelativeLink>
          </AddCreditsBox>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function isCreditsError(error: {type: string}): error is CreditsError {
  return error.type === 'insufficient_credits'
}

const Box = styled.div`
  text-align: center;
  padding-bottom: ${(props) => props.theme.spacing[4]};
`

const CreditsNeeded = styled.h1`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
`

const AddCreditsBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[5]};
`

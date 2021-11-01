import Dialog from '@material-ui/core/Dialog'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import {Icon} from 'lib/fontawesome/Icon'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {obvioRoutes} from 'obvio/Routes'
import {useBilling} from 'obvio/Billing/BillingProvider'
import {useHistory} from 'react-router'

export default function InsufficientCreditsPopup() {
  const {missingCredits, setMissingCredits} = useBilling()
  const history = useHistory()

  const clearMissingCredits = () => setMissingCredits(0)

  const handleAddCredits = () => {
    clearMissingCredits()
    history.push(obvioRoutes.billing.root)
  }

  const creditLabel = missingCredits > 1 ? 'credits' : 'credit'

  return (
    <Dialog open={Boolean(missingCredits)} onClose={clearMissingCredits}>
      <DialogContent>
        <Box>
          <Icon className="sad-tear" />
          <CreditsNeeded>Not Enough Credits</CreditsNeeded>
          <Typography>
            Add <strong>{`${missingCredits} ${creditLabel}`}</strong> to
            complete the request.
          </Typography>
          <AddCreditsBox>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCredits}
            >
              Add Credits
            </Button>
          </AddCreditsBox>
        </Box>
      </DialogContent>
    </Dialog>
  )
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

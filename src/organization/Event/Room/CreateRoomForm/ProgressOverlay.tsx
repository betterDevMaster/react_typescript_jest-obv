import styled from 'styled-components'
import React from 'react'
import Center from 'lib/ui/layout/Center'
import {Spinner} from 'lib/ui/layout/FullPageLoader'
import Typography from '@material-ui/core/Typography'
import {Icon} from 'lib/fontawesome/Icon'
import Button from '@material-ui/core/Button'

type ProgressOverlayProps = {
  showing: boolean
  created: number
  total: number
  failed: boolean
  onRetry: () => void
}

export default function ProgressOverlay(props: ProgressOverlayProps) {
  if (!props.showing) {
    return null
  }

  return (
    <StyledCenter>
      <Box>
        <Content {...props} />
      </Box>
    </StyledCenter>
  )
}

export function Content(props: ProgressOverlayProps) {
  const {created, total, failed} = props

  if (failed) {
    return <FailedAlert {...props} />
  }

  const label = total > 1 ? 'rooms' : 'room'

  return (
    <>
      <Spinner />
      <Typography>
        Creating{' '}
        <strong>
          {created + 1} of {total}
        </strong>{' '}
        {label}...
      </Typography>
    </>
  )
}

function FailedAlert(props: ProgressOverlayProps) {
  return (
    <>
      <WarningIcon iconClass="far fa-exclamation-triangle" />
      <Typography>
        Hmm, we ran into trouble creating all your rooms. <br />
        <strong>
          {props.created} out of {props.total} completed.
        </strong>
      </Typography>
      <RetryButton onClick={props.onRetry} variant="outlined">
        Retry
      </RetryButton>
    </>
  )
}

const Box = styled.div`
  text-align: center;
`

const StyledCenter = styled(Center)`
  background: rgba(255, 255, 255, 0.8);
  z-index: 2;
`

const WarningIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.error};
  font-size: 4rem;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const RetryButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]};
`

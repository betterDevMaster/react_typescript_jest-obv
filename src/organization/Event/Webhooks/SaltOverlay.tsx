import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import {Icon} from 'lib/fontawesome/Icon'
import Button from '@material-ui/core/Button'
import {useWebhooks} from 'organization/Event/WebhooksProvider'

export default function SaltOverlay(props: {open?: boolean; salt: string}) {
  const {closeSaltOverlay} = useWebhooks()
  const isOpen = props.open || false

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <Box>
          <Title>
            <InfoIcon iconClass="far fa-info-circle" /> Webhook CRC Salt
          </Title>
          <Description>
            The following salt has been generated to calculate the CRC Checksum
            on all Webhook request payloads you receive from Obvio. This is the
            only time you will be able to view this value.
          </Description>

          <SaltValue>{props.salt}</SaltValue>

          <Description>
            If you lose this value, you will need to re-generate a new CRC salt.
          </Description>

          <Actions>
            <Button
              aria-label="close salt overlay"
              color="primary"
              onClick={closeSaltOverlay}
              variant="contained"
            >
              OK
            </Button>
          </Actions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const SaltValue = styled.p`
  color: black;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin: 0 0 ${(props) => props.theme.spacing[5]};
  text-align: center;
`
const Box = styled.div`
  text-align: center;
`
const Title = styled.h1`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
`
const Actions = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
const Description = styled.p`
  margin: 0 0 ${(props) => props.theme.spacing[5]};
`

const InfoIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.info};
  font-size: 2rem;
  margin-right: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

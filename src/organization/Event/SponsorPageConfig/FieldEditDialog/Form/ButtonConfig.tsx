import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event'
import BackButton from 'lib/ui/Button/BackButton'
import NavButtonConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig'
import Box from '@material-ui/core/Box'
import DangerButton from 'lib/ui/Button/DangerButton'
import Button from '@material-ui/core/Button'

type Button = NonNullable<Sponsor['buttons']>['entities'][0]

export default function ButtonConfig(props: {
  onClose: () => void
  onChange: (button: Button) => void
  onRemove: () => void
  button: Button | null
}) {
  const {button} = props
  if (!button) {
    return null
  }

  return (
    <>
      <StyledBackButton onClick={props.onClose} />
      <Box mb={3}>
        <NavButtonConfig
          button={button}
          onUpdate={props.onChange}
          onRemove={props.onRemove}
        />
      </Box>
      <Box mb={2}>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.onClose}
          fullWidth
        >
          DONE
        </Button>
      </Box>
      <Box mb={2}>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={props.onRemove}
        >
          REMOVE BUTTON
        </DangerButton>
      </Box>
    </>
  )
}

const StyledBackButton = styled(BackButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`

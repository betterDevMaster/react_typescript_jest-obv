import React from 'react'
import styled from 'styled-components'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'

export default function ConfigureSkipTechCheckRulesButton(props: {
  onClick: () => void
  buttonText?: string
}) {
  return (
    <StyledConfigureRulesButton {...props} buttonText="Skip Tech Check Rules" />
  )
}

const StyledConfigureRulesButton = styled(ConfigureRulesButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

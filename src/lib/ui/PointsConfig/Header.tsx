import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Title, Description} from 'lib/ui/typography'
import Button from 'lib/ui/Button'

export default function Header() {
  return (
    <Container>
      <Box>
        <StyledTitle>Points</StyledTitle>
        <StyledDescription>
          “Short description of what speakers are used for and how they work.”
        </StyledDescription>
      </Box>
      <StyledButton variant="outlined" color="primary">
        Page Settings
      </StyledButton>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing[11]} !important;
`

const StyledTitle = styled(Title)`
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`

const StyledDescription = styled(Description)`
  max-width: 320px;
`

const StyledButton = styled(Button)`
  border-radius: 3px !important;
  border: 1px solid ${(props) => props.theme.colors.primary} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none !important;
  }
`

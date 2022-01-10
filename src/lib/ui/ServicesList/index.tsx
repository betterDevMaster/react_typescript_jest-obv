import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Title, Description} from 'lib/ui/typography'
import CustomButton from 'lib/ui/Button/CustomButton'
import Zapier from 'lib/ui/ServicesList/Zapier'
import Infusionsoft from 'lib/ui/ServicesList/Infusionsoft'

export default function ServicesList() {
  return (
    <Box>
      <Header>
        <StyledTitle>Services</StyledTitle>
        <SaveButton>Save Changes</SaveButton>
        <SaveButtonSm>Save</SaveButtonSm>
      </Header>
      <StyledDescription>
        “Short description of what Services are used for and how they work.”
      </StyledDescription>
      <Zapier link="https://zapier.com/" />
      <Infusionsoft link={() => {}} />
    </Box>
  )
}

const Header = styled(Box)`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: ${(props) =>
    `${props.theme.spacing[3]} ${props.theme.spacing[6]}`} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: ${(props) =>
      `${props.theme.spacing[4]} ${props.theme.spacing[5]}`} !important;
  }
`

const StyledTitle = styled(Title)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 30px !important;
    line-height: 36px !important;
  }
`

const SaveButton = styled(CustomButton)`
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: #ffffff !important;
  background: #20a746 !important;
  border-radius: 3px !important;
  padding: ${(props) => props.theme.spacing[3]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none !important;
  }
`

const SaveButtonSm = styled(SaveButton)`
  display: none !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    max-width: 60px !important;
    display: block !important;
  }
`

const StyledDescription = styled(Description)`
  max-width: 320px !important;
  padding: ${(props) => `0 ${props.theme.spacing[6]}`} !important;
  margin-bottom: ${(props) => `0 ${props.theme.spacing[8]}`} !important;
`

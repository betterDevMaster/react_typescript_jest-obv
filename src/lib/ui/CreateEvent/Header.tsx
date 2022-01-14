import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import {Title, Description} from 'lib/ui/typography'

export default function Header() {
  return (
    <Container>
      <MDFlexBox>
        <Title>Create Your Event</Title>
        <Button variant="contained" color="success">
          Save Changes
        </Button>
      </MDFlexBox>
      <SMFlexBox>
        <Title>Create Event</Title>
        <Button variant="contained" color="success">
          Save
        </Button>
      </SMFlexBox>
      <DescriptionBox>
        <Description>
          “Short description of what Event Settings are used for and how they
          work.”
        </Description>
      </DescriptionBox>
    </Container>
  )
}

const Container = styled(Box)`
  margin-bottom: ${(props) => props.theme.spacing[16]} !important;
`

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: ${(props) => props.theme.spacing[5]} !important;
  }
`

const MDFlexBox = styled(FlexBox)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const SMFlexBox = styled(FlexBox)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
  }
`

const DescriptionBox = styled(Box)`
  max-width: 320px;
`

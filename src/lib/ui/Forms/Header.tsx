import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Title, Description} from 'lib/ui/typography'
import Button from 'lib/ui/Button'
import Icon from 'lib/ui/Icon'

export type HeaderProps = {
  title: string
  hasDiscard?: boolean
  onSave?: () => {}
  onDiscard?: () => {}
}

export default function Header(props: HeaderProps) {
  const {title, hasDiscard, onSave, onDiscard} = props
  const DiscardButton = () => {
    if (hasDiscard) {
      return (
        <GreyButton variant="contained" color="primary" onClick={onDiscard}>
          Discard
        </GreyButton>
      )
    }
    return null
  }

  const SMDiscardButton = () => {
    if (hasDiscard) {
      return (
        <BackButton variant="text" color="dark">
          <Icon className="fas fa-chevron-left" iconSize={10} color="black" />
          Discard
        </BackButton>
      )
    }
    return null
  }

  return (
    <Container>
      <SMDiscardButton />
      <FlexBox>
        <Title>{title}</Title>
        <ButtonsContainer>
          <DiscardButton />
          <MDButton variant="contained" color="success" onClick={onSave}>
            Save Changes
          </MDButton>
          <SMButton variant="contained" color="success" onClick={onSave}>
            Save
          </SMButton>
        </ButtonsContainer>
      </FlexBox>
      <DescriptionBox>
        <Description>
          “Short description of what speakers are used for and how they work.”
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
`

const DescriptionBox = styled(Box)`
  max-width: 320px;
`

const ButtonsContainer = styled(Box)`
  display: flex;
  align-items: center;
`

const MDButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing[5]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const SMButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing[5]} !important;
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
  }
`

const GreyButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.disabled} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const BackButton = styled(Button)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
    align-items: center;
    padding: 0;
    margin-bottom: ${(props) => props.theme.spacing[7]} !important;
  }
`

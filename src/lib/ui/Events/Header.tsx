import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Title} from 'lib/ui/typography'
import Button from 'lib/ui/Button'
import Icon from 'lib/ui/Icon'
import {ViewType} from '.'
import ChangeViewButton from './ChangeViewButton'

export type HeaderProps = {
  viewType: ViewType
}

export default function Header(props: HeaderProps) {
  return (
    <Container>
      <StyledTitle>Events</StyledTitle>
      <RightInnerContainer>
        <ActionContainer>
          <SortButton variant="text" color="default">
            <SortButtonInner>
              Last created
              <Icon className="fas fa-arrow-down" iconSize={10} />
            </SortButtonInner>
          </SortButton>
          <ChangeViewButton viewType={props.viewType} />
        </ActionContainer>
        <StyledButton variant="contained" color="primary">
          <NewButtonInner>
            <Icon className="fas fa-plus" iconSize={10} color="white" />
            New Event
          </NewButtonInner>
        </StyledButton>
      </RightInnerContainer>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing[16]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
    margin-bottom: ${(props) => props.theme.spacing[8]} !important;
  }
`

const StyledTitle = styled(Title)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    text-align: center;
  }
`

const RightInnerContainer = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column-reverse;
  }
`

const ButtonInner = styled(Box)`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`

const SortButton = styled(Button)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0;
    margin: 0;
  }
`

const SortButtonInner = styled(ButtonInner)`
  color: ${(props) => props.theme.colors.gray200} !important;
  i {
    color: ${(props) => props.theme.colors.gray100} !important;
    margin-left: ${(props) => props.theme.spacing[1]} !important;
  }
`

const NewButtonInner = styled(ButtonInner)`
  i {
    margin-right: ${(props) => props.theme.spacing[3]} !important;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
  }
`

const StyledButton = styled(Button)`
  padding: ${(props) =>
    `${props.theme.spacing[3]} ${props.theme.spacing[4]}`} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    padding: ${(props) => props.theme.spacing[4]} !important;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${(props) =>
      `${props.theme.spacing[10]} 0 ${props.theme.spacing[6]}`} !important;
  }
`

const ActionContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${(props) => `0 ${props.theme.spacing[6]}`} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    padding: 0 !important;
    justify-content: space-between;
  }
`

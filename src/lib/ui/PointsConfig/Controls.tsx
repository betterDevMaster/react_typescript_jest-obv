import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import Pagination from 'lib/ui/Pagination'
import TextField from 'lib/ui/TextField'
import Icon from 'lib/ui/Icon'

export type ControlsProps = {
  count: number
  page: number
}

export default function Controls(props: ControlsProps) {
  return (
    <Container>
      <SearchField />
      <Content>
        <ButtonsContainer>
          <StyledButton variant="contained" color="primary">
            Create Action
          </StyledButton>
          <StyledButton variant="contained" color="danger">
            Clear Leaderboard
          </StyledButton>
          <StyledButton variant="outlined" color="primary" hasBorder>
            Export Leaderboard
          </StyledButton>
        </ButtonsContainer>
        <Box display="flex" alignItems="center" justifyContent="center">
          <StyledPagination
            count={props.count}
            page={props.page}
            onChange={() => {}}
          />
        </Box>
      </Content>
    </Container>
  )
}

const SearchField = () => {
  return (
    <SearchContainer display="flex" flexDirection="row" alignItems="center">
      <SearchIconContainer>
        <Icon className="fal fa-search" />
      </SearchIconContainer>
      <StyledTextField variant="outlined" placeholder="Search actions" />
    </SearchContainer>
  )
}

const Container = styled(Box)`
  padding: ${(props) => `${props.theme.spacing[4]} 0`} !important;
`

const SearchContainer = styled(Box)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
  position: relative;
  left: -16px;
`

const SearchIconContainer = styled(Box)`
  position: relative;
  left: 25px;
`

const StyledTextField = styled(TextField)`
  background: #e5e5e5 !important;
  max-width: 360px;
  padding-left: 34px;
`

const Content = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
  }
`

const ButtonsContainer = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
    margin-bottom: ${(props) => props.theme.spacing[8]} !important;
  }
`

const StyledButton = styled(Button)<{hasBorder?: boolean}>`
  border-radius: 3px !important;
  padding: ${(props) =>
    `${props.theme.spacing[2]} ${props.theme.spacing[3]}`} !important;
  margin-left: 0 !important;
  margin-right: ${(props) => props.theme.spacing[5]} !important;
  border: ${(props) =>
    props.hasBorder
      ? `1px solid ${props.theme.colors.primary}`
      : 'none'} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0 !important;
    width: 100%;
    margin: ${(props) => `${props.theme.spacing[2]} 0`} !important;
    padding: ${(props) => props.theme.spacing[3]} !important;
  }
`

const StyledPagination = styled(Pagination)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-top: ${(props) => props.theme.spacing[2]} !important;
  }
`

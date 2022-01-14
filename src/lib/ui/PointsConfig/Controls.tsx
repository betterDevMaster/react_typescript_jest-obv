import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import Pagination from 'lib/ui/Pagination'
import TextField from 'lib/ui/TextField'

export type ControlsProps = {
  count: number
  page: number
}

export default function Controls(props: ControlsProps) {
  return (
    <Container>
      <StyledTextField variant="outlined" placeholder="Search actions" />
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
        <StyledPagination
          count={props.count}
          page={props.page}
          onChange={(value) => {}}
        />
      </Content>
    </Container>
  )
}

const Container = styled(Box)`
  padding: ${(props) => `${props.theme.spacing[4]} 0`} !important;
`

const StyledTextField = styled(TextField)`
  background: #e5e5e5 !important;
  max-width: 360px;
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
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

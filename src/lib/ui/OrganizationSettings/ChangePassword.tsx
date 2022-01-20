import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import {Header, Description, Label} from 'lib/ui/typography'
import PasswordField from 'lib/ui/TextField/PasswordField'

export default function ChangePassword() {
  return (
    <Container>
      <StyledHeader>Change Password</StyledHeader>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FieldLabel>Current Password:</FieldLabel>
          <PasswordField variant="outlined" fullWidth />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FieldLabel>New Password:</FieldLabel>
          <PasswordField variant="outlined" fullWidth />
        </Grid>
      </Grid>
      <DescriptionBox>
        <Description>“Short description on password complexity</Description>
      </DescriptionBox>
    </Container>
  )
}

const Container = styled(Box)`
  position: relative;
  padding: ${(props) =>
    `${props.theme.spacing[5]} ${props.theme.spacing[6]}`} !important;
`

const StyledHeader = styled(Header)`
  margin-bottom: ${(props) => props.theme.spacing[5]} !important;
`

const FieldLabel = styled(Label)`
  margin-bottom: ${(props) => props.theme.spacing[2]} !important;
`

const DescriptionBox = styled(Box)`
  padding: ${(props) =>
    `${props.theme.spacing[1]} ${props.theme.spacing[7]}`} !important;
  border-left: 1px solid #0d5ed0;
  position: absolute;
  right: ${(props) => props.theme.spacing[7]} !important;
  bottom: ${(props) => props.theme.spacing[25]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Subheading from 'lib/ui/typography/Subheading'
import {Description} from 'lib/ui/typography'
import TextField from 'lib/ui/TextField'

export type AccountInfoProps = {
  firstName?: string
  lastName?: string
  email?: string
}

export default function AccountInfo(props: AccountInfoProps) {
  const {firstName, lastName, email} = props
  return (
    <Container>
      <Subheading>Account Info</Subheading>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FieldLabel>First Name:</FieldLabel>
          <TextField variant="outlined" fullWidth value={firstName} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldLabel>Last Name:</FieldLabel>
          <TextField variant="outlined" fullWidth value={lastName} />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FieldLabel>Email Address:</FieldLabel>
          <TextField variant="outlined" fullWidth value={email} />
        </Grid>
      </Grid>
    </Container>
  )
}

const Container = styled(Box)`
  padding: ${(props) =>
    `${props.theme.spacing[5]} ${props.theme.spacing[6]}`} !important;
`

const FieldLabel = styled(Description)`
  color: #000000 !important;
  margin-bottom: ${(props) => props.theme.spacing[2]} !important;
`

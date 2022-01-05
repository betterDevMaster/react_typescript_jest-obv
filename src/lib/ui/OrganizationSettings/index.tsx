import React from 'react'
import Box from '@material-ui/core/Box'
import Header from './Header'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'

export type OrganizationSettingsProps = {
  firstName: string
  lastName: string
  email: string
}

export default function OrganizationSettings(props: OrganizationSettingsProps) {
  const {firstName, lastName, email} = props
  return (
    <Box>
      <Header firstName={firstName} lastName={lastName} />
      <AccountInfo firstName={firstName} lastName={lastName} email={email} />
      <ChangePassword />
    </Box>
  )
}

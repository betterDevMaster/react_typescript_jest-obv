import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import {Header as Typography} from 'lib/ui/typography'
import avatar from 'assets/images/test.png'

export type HeaderProps = {
  firstName: string
  lastName: string
}

export default function Header(props: HeaderProps) {
  const {firstName, lastName} = props
  return (
    <Container>
      <UserBox>
        <ProfileAvatar src={avatar} alt="profile avatar" />
        <Typography>
          {firstName} {lastName}
        </Typography>
      </UserBox>
      <Button variant="contained" color="success">
        Save Changes
      </Button>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing[6]} !important;
  border-bottom: 1px solid #000000;
`

const UserBox = styled(Box)`
  display: flex;
  align-items: center;
`

const ProfileAvatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-right: ${(props) => props.theme.spacing[6]} !important;
`

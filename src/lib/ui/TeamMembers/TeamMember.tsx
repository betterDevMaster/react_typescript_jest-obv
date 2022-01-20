import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import IconButton from 'lib/ui/IconButton'
import Icon from 'lib/ui/Icon'
import {Label} from 'lib/ui/typography'

export type PermissionProps = {
  configure_event: boolean
  handle_tech_check: boolean
}

export type TeamMemberProps = {
  name: string
  permissions?: PermissionProps
}

export default function TeamMember(props: {
  teamMember: TeamMemberProps
  isOdd: boolean
  onClick: () => void
}) {
  const {teamMember, isOdd, onClick} = props
  const {name} = teamMember

  return (
    <Container
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      isOdd={isOdd}
    >
      <Name>{name}</Name>
      <IconButton onClick={onClick}>
        <Icon className="far fa-ellipsis-h" iconSize={24} color="#929292" />
      </IconButton>
    </Container>
  )
}

type ContainerProps = {
  isOdd: boolean
}

const Container = styled(Box)<ContainerProps>`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[3]}`};
  background-color: ${(props) => (props.isOdd ? '#EAEAEA' : '#DADADA')};
`

const Name = styled(Label)`
  font-weight: 500 !important;
`

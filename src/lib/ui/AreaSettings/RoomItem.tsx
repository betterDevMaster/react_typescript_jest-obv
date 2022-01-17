import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'

import {Label} from 'lib/ui/typography'
import {Room} from 'lib/ui/AreaSettings'
import Icon from 'lib/ui/Icon'
import IconButton from 'lib/ui/IconButton'
import Menu from 'lib/ui/Menu'
import MenuOption from 'lib/ui/MenuOption'
import MenuDivider from 'lib/ui/MenuDivider'
import DeleteIcon from 'assets/images/ui/icons/trash.svg'
import EditIcon from 'assets/images/ui/icons/edit.svg'
import DisableIcon from 'assets/images/ui/icons/disable.svg'
import ExportIcon from 'assets/images/ui/icons/export.svg'
import ZoomIcon from 'assets/images/ui/icons/zoom.svg'

export type RoomItemProps = {
  isHeader?: boolean
  room?: Room
}

export default function RoomItem(props: RoomItemProps) {
  const {isHeader, room} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  if (isHeader || !room) {
    return (
      <Container>
        <NameBox>
          <HeaderLabel>Name</HeaderLabel>
        </NameBox>
        <MaxAttendeesBox>
          <HeaderLabel>Max Attendees</HeaderLabel>
        </MaxAttendeesBox>
      </Container>
    )
  }

  return (
    <Container>
      <NameBox>
        <Label>{room.name}</Label>
      </NameBox>
      <MaxAttendeesBox>
        <Label>{room.maxAttendees}</Label>
      </MaxAttendeesBox>
      <DisabledBox disabled={room.disabled}>Disabled</DisabledBox>
      <IconButton onClick={handleMenu}>
        <Icon className="fas fa-ellipsis-h" color="black" iconSize={18} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuOption icon={DeleteIcon} name="Delete" />
        <MenuDivider />
        <MenuOption icon={EditIcon} name="Edit" />
        <MenuDivider />
        <MenuOption icon={DisableIcon} name="Disable" />
        <MenuDivider />
        <MenuOption icon={ExportIcon} name="Export List" />
        <MenuDivider />
        <MenuOption icon={ZoomIcon} name="Zoom Recording" color="primary" />
      </Menu>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.spacing[4]} ${props.theme.spacing[3]}`} !important;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray300} !important;
`

const HeaderLabel = styled(Label)`
  font-weight: 500 !important;
  font-size: 16px !important;
  line-height: 19px !important;
`

const NameBox = styled(Box)`
  width: 174px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100px;
  }
`

const MaxAttendeesBox = styled(Box)`
  flex: 1;
`

const DisabledBox = styled(Box)<{disabled?: boolean}>`
  border: 1px solid ${(props) => props.theme.colors.accent};
  padding: ${(props) => `${props.theme.spacing[2]} ${props.theme.spacing[3]}`};
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  color: ${(props) => props.theme.colors.accent};
  border-radius: 3px;
  visibility: ${(props) => (props.disabled ? 'visible' : 'hidden')};
  margin-right: ${(props) => props.theme.spacing[7]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    border: none;
  }
`

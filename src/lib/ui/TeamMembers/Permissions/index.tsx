import React, {useState} from 'react'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from 'lib/ui/Checkbox'
import {TeamMemberProps} from 'lib/ui/TeamMembers/TeamMember'
import {Label, MenuItemLabel} from 'lib/ui/typography'
import IconButton from 'lib/ui/IconButton'
import Icon from 'lib/ui/Icon'
import Menu from 'lib/ui/Menu'
import MenuDivider from 'lib/ui/MenuDivider'

export default function Permissions(props: {teamMembers: TeamMemberProps[]}) {
  return (
    <Table>
      <Tr>
        <Td first>
          <Label>Name</Label>
        </Td>
        <Td center>
          <Label>Configure Event</Label>
        </Td>
        <Td center>
          <Label>Handle Tech Check</Label>
        </Td>
        <Td last />
      </Tr>
      {props.teamMembers.map((teamMember: TeamMemberProps, index: number) => {
        const {name, permissions} = teamMember

        return (
          <Item
            key={index}
            teamMember={teamMember}
            last={index === props.teamMembers.length - 1}
          />
        )
      })}
    </Table>
  )
}

const Item = (props: {teamMember: TeamMemberProps; last?: boolean}) => {
  const {name, permissions} = props.teamMember

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const ItemMenu = () => {
    return (
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
        <MenuOption>
          <Icon className="far fa-trash-alt" iconSize={12} color="#4f4f4f" />
          <MenuItemLabel>Delete</MenuItemLabel>
        </MenuOption>
        <MenuDivider />
        <MenuOption>
          <Icon className="far fa-edit" iconSize={12} color="#4f4f4f" />
          <MenuItemLabel>Edit Name</MenuItemLabel>
        </MenuOption>
      </Menu>
    )
  }

  return (
    <Tr last={props.last}>
      <Td first>
        <Label>{name}</Label>
      </Td>
      <Td center>
        <Checkbox checked={permissions?.configure_event} />
      </Td>
      <Td center>
        <Checkbox checked={permissions?.handle_tech_check} />
      </Td>
      <Td last>
        <IconButton onClick={handleMenu}>
          <Icon className="fas fa-ellipsis-h" color="black" iconSize={18} />
        </IconButton>
      </Td>
      <ItemMenu />
    </Tr>
  )
}

const Table = styled.div`
  width: 100%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dfdfdf;
  border-radius: 3px;
`

type TrProps = {
  last?: boolean
}

const Tr = styled.div<TrProps>`
  border-bottom: ${(props) => (props.last ? 'none' : '1px solid #dfdfdf')};
  display: flex;
  flex-direction: row;
  padding: 16px 12px;
  justify-content: space-between;
`

const Td = (props: {
  first?: boolean
  last?: boolean
  center?: boolean
  children?: React.ReactElement
}) => {
  const {first, last, center, children} = props

  const getJustifyContent = () => {
    if (center) {
      return 'center'
    }

    if (last) {
      return 'flex-end'
    }

    return 'flex-start'
  }

  const getWidth = () => {
    if (first) {
      return '20%'
    }

    if (last) {
      return '10%'
    }

    return '35%'
  }

  return (
    <StyledTd justifyContent={getJustifyContent()} width={getWidth()}>
      {children}
    </StyledTd>
  )
}

type TdProps = {
  justifyContent: string
  width: string
}

const StyledTd = styled.div<TdProps>`
  display: flex;
  width: ${(props) => props.width};
  justify-content: ${(props) => props.justifyContent};
`

const MenuOption = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 14px !important;
  width: 150px !important;
`

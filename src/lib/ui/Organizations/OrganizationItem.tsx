import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Label} from 'lib/ui/typography'
import IconButton from 'lib/ui/IconButton'
import Icon from 'lib/ui/Icon'
import {Organization, ViewType} from '.'
import Menu from 'lib/ui/Menu'
import MenuOption from 'lib/ui/MenuOption'
import MenuDivider from 'lib/ui/MenuDivider'
import ArchieveIcon from 'assets/images/ui/icons/archieve.svg'

export type OrganizationItemProps = {
  viewType: ViewType
  organization: Organization
  onClick?: () => void
}

export default function OrganizationItem(props: OrganizationItemProps) {
  const {viewType, organization, onClick} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

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
        <MenuOption icon={ArchieveIcon} name="Archive" />
        <MenuDivider />
        <MenuOption name="Deactiveate" color="accent" />
      </Menu>
    )
  }

  if (viewType === ViewType.LIST) {
    return (
      <ListContainer onClick={onClick}>
        <LeftInner>
          <ListAvatar>
            <img src={organization.avatar} alt="list avatar" />
          </ListAvatar>
          <Label>{organization.name}</Label>
        </LeftInner>
        <RightInner>
          <IconButton onClick={handleMenu}>
            <Icon className="fas fa-ellipsis-h" color="black" iconSize={18} />
          </IconButton>
        </RightInner>
        <ItemMenu />
      </ListContainer>
    )
  }

  return (
    <GridContainer onClick={onClick}>
      <GridAvatar>
        <img src={organization.avatar} alt="grid avatar" />
      </GridAvatar>
      <GridContent>
        <Label>{organization.name}</Label>
        <IconButton onClick={handleMenu}>
          <Icon className="fas fa-ellipsis-h" iconSize={18} color="black" />
        </IconButton>
      </GridContent>
      <ItemMenu />
    </GridContainer>
  )
}

const ListContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.spacing[4]} ${props.theme.spacing[3]}`} !important;
  margin-bottom: ${(props) => props.theme.spacing[1]} !important;
`

const LeftInner = styled(Box)`
  display: flex;
  align-items: center;
  height: 44px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    align-items: flex-start;
  }
`

const ListAvatar = styled(Box)`
  width: 66px;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => props.theme.spacing[8]} !important;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const RightInner = styled(Box)`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const GridContainer = styled(Box)`
  width: 100%;
  max-width: 270px;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-bottom: ${(props) => props.theme.spacing[11]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 200px;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    max-width: 270px;
  }
`

const GridAvatar = styled(Box)`
  width: 100%;
  height: 180px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  img {
    max-width: 100%;
    max-height: 100%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    height: 133px;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 180px;
  }
`

const GridContent = styled(Box)`
  padding: ${(props) => `${props.theme.spacing[4]} 0`} !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

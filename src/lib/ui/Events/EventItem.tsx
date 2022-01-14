import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Label, Description, Tiny} from 'lib/ui/typography'
import IconButton from 'lib/ui/IconButton'
import Icon from 'lib/ui/Icon'
import LiveIcon from 'assets/images/ui/icons/live.svg'
import {Event, ViewType} from '.'
import Menu from 'lib/ui/Menu'
import MenuOption from 'lib/ui/MenuOption'
import MenuDivider from 'lib/ui/MenuDivider'
import DuplicateIcon from 'assets/images/ui/icons/duplicate.svg'
import ArchieveIcon from 'assets/images/ui/icons/archieve.svg'
import DeleteIcon from 'assets/images/ui/icons/trash.svg'

export type EventItemProps = {
  viewType: ViewType
  event: Event
  onClick?: () => void
}

export default function EventItem(props: EventItemProps) {
  const {viewType, event, onClick} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const LiveBox = (props: {live: boolean}) => {
    if (props.live) {
      return (
        <FlexBox>
          <Tiny>Live</Tiny>
          <img src={LiveIcon} alt="live icon" />
        </FlexBox>
      )
    }
    return <FlexBox></FlexBox>
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
        <MenuOption name="Move event from organization" />
        <MenuDivider />
        <MenuOption icon={DuplicateIcon} name="Duplicate event" />
        <MenuDivider />
        <MenuOption icon={ArchieveIcon} name="Archive event" />
        <MenuDivider />
        <MenuOption icon={DeleteIcon} name="Delete event" />
      </Menu>
    )
  }

  if (viewType === ViewType.LIST) {
    return (
      <ListContainer onClick={onClick}>
        <LeftInner>
          <ListAvatar>
            <img src={event.avatar} alt="list avatar" />
          </ListAvatar>
          <Box>
            <Label>{event.name}</Label>
            <SMEventURLBox>{event.url}</SMEventURLBox>
          </Box>
        </LeftInner>
        <RightInner>
          <MDEventURLBox>{event.url}</MDEventURLBox>
          <LiveBox live={event.live} />
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
        <img src={event.avatar} alt="grid avatar" />
      </GridAvatar>
      <GridContent>
        <LiveBox live={event.live} />
        <IconButton onClick={handleMenu}>
          <Icon className="fas fa-ellipsis-h" iconSize={18} color="black" />
        </IconButton>
      </GridContent>
      <StyledLabel>{event.name}</StyledLabel>
      <Description>{event.url}</Description>
      <ItemMenu />
    </GridContainer>
  )
}

const EventURLBox = styled(Box)`
  padding: ${(props) =>
    `${props.theme.spacing[1]} ${props.theme.spacing[6]}`} !important;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.primary};
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => `2px ${props.theme.spacing[6]}`} !important;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 12px;
    line-height: 14px;
  }
`

const MDEventURLBox = styled(EventURLBox)`
  display: block;
  margin-right: ${(props) => props.theme.spacing[8]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const SMEventURLBox = styled(EventURLBox)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
    margin-top: ${(props) => props.theme.spacing[4]} !important;
  }
`

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
  width: 34px;
  margin-right: ${(props) => props.theme.spacing[8]} !important;
  img {
    margin-left: ${(props) => props.theme.spacing[1]} !important;
  }
`

const StyledLabel = styled(Label)`
  margin-bottom: 2px !important;
`

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
    object-fit: contain;
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
  height: 156px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0px 0px;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    height: 110px;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 156px;
  }
`

const GridContent = styled(Box)`
  padding: ${(props) =>
    `${props.theme.spacing[1]} ${props.theme.spacing[3]}`} !important;
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.colors.gray300};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 0px 0px 4px 4px;
`

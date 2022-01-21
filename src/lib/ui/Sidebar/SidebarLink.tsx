import React, {useState} from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {SidebarItem} from 'lib/ui/Sidebar'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import styled from 'styled-components'
import ListItemIcon from '@material-ui/core/ListItemIcon'

type SidebarLinkProps = {
  icon: JSX.Element
  children?: SidebarItem[]
  link?: string
  nested?: boolean
  label: string
  isSidebarOpened: boolean
  onClick: (itemName: string) => void
  location: string
}
export default function SidebarLink(props: SidebarLinkProps) {
  const {
    icon,
    children,
    nested,
    onClick,
    label,
    isSidebarOpened,
    location,
  } = props

  const [isOpen, setIsOpen] = useState(false)

  const toggleCollapse = () => {
    setIsOpen(!isOpen)
  }

  const isLinkActive = location === label

  if (!children)
    return (
      <StyledListItem
        button
        onClick={() => onClick(label)}
        disableRipple
        isSelected={Boolean(isLinkActive)}
      >
        <ListItemIcon>{nested ? null : icon}</ListItemIcon>
        <ListItemText primary={label} />
      </StyledListItem>
    )

  return (
    <>
      <StyledListItem
        button
        onClick={toggleCollapse}
        disableRipple
        isSelected={Boolean(isLinkActive)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </StyledListItem>
      {children && (
        <Collapse in={isOpen && !isSidebarOpened} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((children, index) => (
              <SidebarLink
                key={index}
                isSidebarOpened={isSidebarOpened}
                nested
                onClick={onClick}
                icon={icon}
                location={location}
                {...children}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}

const StyledListItem = styled(ListItem)<{isSelected: boolean}>`
  background-color: ${(props) =>
    props.isSelected ? '#3490DC !important' : 'transparent'};
  padding: ${(props) =>
    `${props.theme.spacing[4]} ${props.theme.spacing[4]}`} !important;
  font-size: 16px !important;
`

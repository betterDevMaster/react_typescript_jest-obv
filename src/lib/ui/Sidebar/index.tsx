import React, {useState, useEffect} from 'react'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'

import SidebarLink from 'lib/ui/Sidebar/SidebarLink'
import Icon from 'lib/ui/Icon'
import styled from 'styled-components'
import Button from 'lib/ui/Button'
import PopoverMenuItems from 'lib/ui/Sidebar/PopoverMenuItems'

export type SidebarItem = {
  label: string
  iconName: string
  link?: string
  children?: SidebarItem[]
}

type SidebarProps = {
  isCollapsed: boolean
  location?: string
  children?: JSX.Element | JSX.Element[] | string
  onClick: (itemName: string) => void
  showPopver: boolean
}
export default function Sidebar(props: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed)
  const [location, setLocation] = useState(props.location || '')

  const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null)
  const [mouseHoverIndex, setMouseHoverIndex] = useState(-1)

  useEffect(() => {
    setIsCollapsed(props.isCollapsed)
  }, [props.isCollapsed])

  const sidebarItems = useSidebarLists()

  const handleDrawerIcon = () => {
    setIsCollapsed(!isCollapsed)
  }

  const onClickSidebarItem = (itemName: string) => {
    if (props.onClick) {
      props.onClick(itemName)
      setLocation(itemName)
    }
  }

  const handleMouseOver = (index: number) => (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    setPopoverEl(event.currentTarget)
    setMouseHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setPopoverEl(null)
    setMouseHoverIndex(-1)
  }

  return (
    <Container>
      <StyledDrawer variant="permanent" isCollapsed={isCollapsed}>
        <Toolbar />
        <List>
          {sidebarItems.map((item, index) => (
            <div
              onMouseEnter={handleMouseOver(index)}
              onMouseLeave={() => handleMouseLeave()}
              key={index}
            >
              <SidebarLink
                icon={<StyledIcon className={item.iconName} iconSize={28} />}
                link={item.link}
                children={item.children}
                onClick={onClickSidebarItem}
                isSidebarOpened={isCollapsed}
                label={item.label}
                location={location}
              />
            </div>
          ))}
        </List>
        <Hidden smDown>
          <SidebarAction isCollapsed={isCollapsed}>
            <MenuIconButton
              isCollapsed={isCollapsed}
              handleDrawerIcon={handleDrawerIcon}
            />
          </SidebarAction>
        </Hidden>
      </StyledDrawer>
      <div>
        <Toolbar />
        <div>{props.children}</div>
      </div>
      <PopoverMenuItems
        anchorEl={popoverEl}
        mouseHoverIndex={mouseHoverIndex}
        show={props.showPopver}
      />
    </Container>
  )
}

function MenuIconButton(props: {
  isCollapsed: boolean
  handleDrawerIcon: () => void
}) {
  if (props.isCollapsed) {
    return (
      <Button
        onClick={props.handleDrawerIcon}
        fullWidth
        aria-label="close drawer"
        variant="text"
        color="default"
        disableBorderRadius
        disablePadding
      >
        <StyledIcon className="fas fa-expand-alt" />
      </Button>
    )
  }
  return (
    <Button
      aria-label="open drawer"
      onClick={props.handleDrawerIcon}
      fullWidth
      variant="contained"
      color="light"
      disableBorderRadius
    >
      <Icon className="fas fa-compress-alt" color="#000000" />
      Collapse
    </Button>
  )
}

const StyledIcon = styled(Icon)`
  color: #ffffff;
`

const StyledDrawer = styled(Drawer)<{isCollapsed: boolean}>`
  flex-shrink: 0;
  white-space: nowrap;

  .MuiDrawer-paper {
    top: 0;
    width: ${(props) => (props.isCollapsed ? 72 : 260)}px;
    color: #ffffff;
    overflow-x: hidden;
    background-color: #131d34;
    display: block;
    z-index: auto;
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      width: ${(props) => (props.isCollapsed ? '0%' : '100%')};
    }
  }

  ${(props) =>
    props.isCollapsed
      ? `
    width: 72px;
    transition: width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
  `
      : `
    transition: width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
    overflow-x: hidden;
    width: 260px;
  `}
`

const SidebarAction = styled.div<{isCollapsed: boolean}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  bottom: 0px;
  width: ${(props) => (props.isCollapsed ? '72px' : '261px')};
  position: fixed;
  border-top: 1px solid;
  background-color: #131d34;
  padding: ${(props) =>
    !props.isCollapsed ? 'unset' : `${props.theme.spacing[2]} 0px`};
`

const Container = styled.div`
  display: flex;
`
/**
 * Will define sidebar items according to user's permission
 *
 * Currently it shows all items, but will update this later.
 */
export function useSidebarLists() {
  const items: SidebarItem[] = [
    {
      label: 'Event',
      iconName: 'fal fa-calendar-alt',
      children: [
        {
          label: 'Setting',
          iconName: '',
          link: '/Setting',
        },
      ],
    },
    {
      label: 'Check In',
      iconName: 'fal fa-tasks',
      link: '',
    },
    {
      label: 'Design',
      iconName: 'fal fa-crop',
      link: '',
    },
    {
      label: 'Features',
      iconName: 'fal fa-megaphone',
      link: '',
    },
    {
      label: 'Attendees',
      iconName: 'fal fa-users',
      link: '',
    },
    {
      label: 'Areas',
      iconName: 'fal fa-person-booth',
      link: '',
    },
    {
      label: 'Reporting',
      iconName: 'fal fa-chart-line',
      link: '',
    },
    {
      label: 'Production',
      iconName: 'fal fa-cogs',
      link: '',
    },
    {
      label: 'Admin',
      iconName: 'fal fa-user',
      link: '',
    },
  ]

  return items
}

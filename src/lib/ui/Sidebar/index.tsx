import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from 'lib/ui/Icon'
import {spacing, muiTheme} from 'lib/ui/theme'
import {Grid} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0px 4px',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: 240,
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    [muiTheme.breakpoints.down('sm')]: {
      width: '100%',
    },
    '& .MuiDrawer-paper': {
      width: 240,
      [muiTheme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
  },
  drawerClose: {
    transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    overflowX: 'hidden',
    width: '57px',
    '& .MuiDrawer-paper': {
      width: '57px',
      overflowX: 'hidden',
    },
  },
  listItemText: {
    marginLeft: spacing[12],
  },
})

export type SidebarItem = {
  name: string
  iconName: string
  path?: string
}

type SidebarProps = {
  isCollapsed: boolean
  children?: JSX.Element | JSX.Element[] | string | null
  onClick: (itemName: string) => void
}
export default function Sidebar(props: SidebarProps) {
  const classes = useStyles()
  const [isCollapsed, setIsCollapsed] = React.useState(props.isCollapsed)

  const sidebarItems = useSidebarLists()

  const handleDrawerIcon = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Grid className={classes.root}>
      <Drawer
        variant="permanent"
        className={isCollapsed ? classes.drawerOpen : classes.drawerClose}
      >
        <Grid className={classes.toolbar}>
          <MenuIconButton
            isCollapsed={isCollapsed}
            handleDrawerIcon={handleDrawerIcon}
          />
        </Grid>
        <Divider />
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => props.onClick(item.name)}
            >
              <Icon className={item.iconName} iconSize={24} />
              <ListItemText
                primary={item.name}
                className={classes.listItemText}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Grid>{props.children}</Grid>
    </Grid>
  )
}

function MenuIconButton(props: {
  isCollapsed: boolean
  handleDrawerIcon: () => void
}) {
  if (props.isCollapsed) {
    return (
      <IconButton onClick={props.handleDrawerIcon}>
        <ChevronLeftIcon />
      </IconButton>
    )
  }
  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={props.handleDrawerIcon}
      edge="start"
    >
      <MenuIcon />
    </IconButton>
  )
}

/**
 * Will define sidebar items according to user's permission
 *
 * Currently it shows all items, but will update this later.
 */
function useSidebarLists() {
  const items: SidebarItem[] = [
    {
      name: 'Event',
      iconName: 'fas fa-calendar-alt',
      path: '',
    },
    {
      name: 'Check In',
      iconName: 'fas fa-tasks',
      path: '',
    },
    {
      name: 'Design',
      iconName: 'fas fa-crop',
      path: '',
    },
    {
      name: 'Features',
      iconName: 'fas fa-user',
      path: '',
    },
    {
      name: 'Attendees',
      iconName: 'fas fa-users',
      path: '',
    },
    {
      name: 'Areas',
      iconName: 'fad fa-person-booth',
      path: '',
    },
    {
      name: 'Reporting',
      iconName: 'fas fa-chart-line',
      path: '',
    },
    {
      name: 'Production',
      iconName: 'fas fa-cogs',
      path: '',
    },
    {
      name: 'Admin',
      iconName: 'fas fa-user',
      path: '',
    },
  ]

  return items
}

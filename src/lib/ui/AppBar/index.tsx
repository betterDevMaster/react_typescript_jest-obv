import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import People from '@material-ui/icons/People'
import Event from '@material-ui/icons/Event'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import logo from 'assets/images/logo.png'
import {obvioRoutes} from 'obvio/Routes'
import {TeamMember, User} from 'auth/user'
import Hidden from '@material-ui/core/Hidden'
import ProfileButtonAvatar from 'lib/ui/avatar/ProfileButtonAvatar'
import Icon from 'lib/ui/Icon'
import IconButton from 'lib/ui/IconButton'

type AppBarProps = {
  user: TeamMember
  logout: () => void
  homeLinkTarget: string
  organizationName?: string
  eventName?: string
  routeEvents?: string
  routeTeam?: string
  collapsedSidebar?: boolean
  collapsableSidebar: (flag: boolean) => void
}

export default function AppBar(props: AppBarProps) {
  const useStyles = makeStyles(() => ({
    root: {
      backgroundColor: '#ffffff',
      zIndex: 100,
      color: 'black',
    },
    logoOrganization: {
      display: 'flex',
      alignItems: 'center',
    },
  }))
  const classes = useStyles()

  const {
    user,
    logout,
    homeLinkTarget,
    organizationName,
    eventName,
    routeEvents,
    routeTeam,
  } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const [statusSidebar, setStatusSidebar] = useState(props.collapsedSidebar)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
  }

  const handleMobileSidebar = () => {
    props.collapsableSidebar(!statusSidebar)
    setStatusSidebar(!statusSidebar)
  }

  return (
    <MuiAppBar className={classes.root} position="absolute">
      <StyledToolbar>
        <Hidden smUp>
          <Right>
            <MobileCollapseButton
              onClick={handleMobileSidebar}
              isCollapsed={statusSidebar}
            />
          </Right>
        </Hidden>
        <div className={classes.logoOrganization}>
          <Logo>
            <RelativeLink to={obvioRoutes.organizations.root} disableStyles>
              <img src={logo} alt="Obv.io" />
            </RelativeLink>
          </Logo>
          <Hidden smDown>
            <HomeLink to={homeLinkTarget} aria-label="home link" disableStyles>
              {organizationName}
            </HomeLink>
            <span> {'>'} </span>
            <HomeLink to={homeLinkTarget} aria-label="event link" disableStyles>
              {eventName}
            </HomeLink>
          </Hidden>
        </div>
        <Left>
          <Hidden smDown>
            <RelativeLink to={routeEvents || ''} disableStyles>
              <Button startIcon={<Event />}>Events</Button>
            </RelativeLink>
            <RelativeLink
              to={routeTeam || ''}
              aria-label="team link"
              disableStyles
            >
              <Button startIcon={<People />}>Team</Button>
            </RelativeLink>
          </Hidden>
          <Button
            startIcon={<ProfileButtonAvatar />}
            onClick={handleMenu}
            color="default"
            aria-label="account menu"
          >
            <Hidden only={['xs']}>
              Account
              <Icon className="fal fa-angle-down" iconSize={14} />
            </Hidden>
          </Button>
          <Menu
            MenuListProps={{
              disablePadding: true,
            }}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <UserMenuItem user={user} />
            <ChangePasswordMenuItem />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Left>
      </StyledToolbar>
    </MuiAppBar>
  )
}

// Not actually using the forwarded ref, since this isn't
// an actual MUI MenuItem, but we get a forward
// ref error if we don't receive it.
const UserMenuItem = React.forwardRef((props: {user: User}, _ref) => {
  return (
    <>
      <UserEmail>
        <LoggedInAsLabel>Logged in as</LoggedInAsLabel>
        <br />
        {props.user.email}
      </UserEmail>
      <Divider />
    </>
  )
})

function ChangePasswordMenuItem() {
  const history = useHistory()

  const goToChangePassword = () => {
    history.push(obvioRoutes.change_password)
  }

  return (
    <>
      <MenuItem onClick={goToChangePassword}>Change Password</MenuItem>
      <Divider />
    </>
  )
}

function MobileCollapseButton(props: {
  isCollapsed?: boolean
  onClick: (flag: boolean) => void
}) {
  if (!props.isCollapsed) {
    return (
      <IconButton onClick={() => props.onClick(false)}>
        <Icon className="far fa-times" iconSize={24} />
      </IconButton>
    )
  }
  return (
    <IconButton onClick={() => props.onClick(true)}>
      <Icon className="far fa-bars" iconSize={24} />
    </IconButton>
  )
}

const Logo = styled.div`
  flex: 1;
  display: flex;

  a {
    margin-right: 20px;
    width: 120px;
    img {
      max-width: 100%;
    }
  }
`
const HomeLink = styled(RelativeLink)`
  flex: 1;
  color: #000000;
  white-space: nowrap;
`

const UserEmail = styled.div`
  padding: 6px 16px;
`

const LoggedInAsLabel = styled.span`
  color: ${(props) => props.theme.colors.text.muted};
  font-size: 0.75rem;
`

const StyledToolbar = styled(Toolbar)`
  justify-content: center;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    justify-content: flex-start;
  }
`

const Left = styled.div`
  right: 5px;
  position: fixed;
`

const Right = styled.div`
  left: 5px;
  position: fixed;
`

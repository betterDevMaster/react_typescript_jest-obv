import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import People from '@material-ui/icons/People'
import Event from '@material-ui/icons/Event'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useOrganization} from 'organization/OrganizationProvider'
import Button from '@material-ui/core/Button'
import HasPermission from 'organization/HasPermission'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import CreditsMenuItem from 'obvio/Billing/CreditsMenuItem'
import Divider from '@material-ui/core/Divider'
import {useIsOwner} from 'organization/OwnerProvider'
import logo from 'assets/images/logo.png'
import {obvioRoutes} from 'obvio/Routes'
import {useObvioAuth, useObvioUser} from 'obvio/auth'
import {
  PURCHASE_CREDITS,
  usePermissions,
} from 'organization/PermissionsProvider'
import OrganizationCreditsMenuItem from 'obvio/Billing/OrganizationCreditsMenuItem'

export default function AppBar() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: '#ffffff',
    },
    toolbar: {
      justifyContent: 'space-between',
    },
    logoOrganization: {
      display: 'flex',
      alignItems: 'center',
    },
  }))
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useObvioAuth()
  const history = useHistory()
  const {routes, organization} = useOrganization()
  const homeLinkTarget = useHomeLink()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
    history.push(routes.login)
  }

  return (
    <MuiAppBar className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoOrganization}>
          <Logo>
            <RelativeLink to={obvioRoutes.organizations.root} disableStyles>
              <img src={logo} alt="Obv.io" />
            </RelativeLink>
          </Logo>
          <HomeLink to={homeLinkTarget} aria-label="home link" disableStyles>
            {organization.name}
          </HomeLink>
        </div>
        <div>
          <RelativeLink to={routes.events.root} disableStyles>
            <Button startIcon={<Event />}>Events</Button>
          </RelativeLink>
          <HasPermission permission={UPDATE_TEAM}>
            <RelativeLink to={routes.team} aria-label="team link" disableStyles>
              <Button startIcon={<People />}>Team</Button>
            </RelativeLink>
          </HasPermission>
          <Button
            startIcon={<AccountCircle />}
            onClick={handleMenu}
            color="default"
          >
            Account
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
            <UserMenuItem />
            <UserCreditsMenuItem />
            <OrgCreditsMenuItem />
            <ChangePasswordMenuItem />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

// Not actually using the forwarded ref, since this isn't
// an actual MUI MenuItem, but we get a forward
// ref error if we don't receive it.
const UserMenuItem = React.forwardRef(() => {
  const user = useObvioUser()

  return (
    <>
      <UserEmail>
        <LoggedInAsLabel>Logged in as</LoggedInAsLabel>
        <br />
        {user.email}
      </UserEmail>
      <Divider />
    </>
  )
})

function UserCreditsMenuItem() {
  return (
    <>
      <CreditsMenuItem />
      <Divider />
    </>
  )
}

function OrgCreditsMenuItem() {
  // If we're logged-in as the owner, showing 2 menu items for the same
  // credits is confusing so we'll hide the organization one.
  const isOwner = useIsOwner()
  if (isOwner) {
    return null
  }

  return (
    <>
      <OrganizationCreditsMenuItem />
      <Divider />
    </>
  )
}

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

function useHomeLink() {
  const {routes} = useOrganization()
  const isOwner = useIsOwner()
  const {can} = usePermissions()

  if (isOwner) {
    return routes.settings
  }

  if (can(PURCHASE_CREDITS)) {
    return routes.settings
  }

  return routes.events.root
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

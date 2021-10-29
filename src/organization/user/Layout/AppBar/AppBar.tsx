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
import {useOrganizationAuth} from 'organization/auth'
import Button from '@material-ui/core/Button'
import HasPermission from 'organization/HasPermission'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import CreditsMenuItem from 'obvio/Billing/CreditsMenuItem'
import Divider from '@material-ui/core/Divider'
import {useIsOwner} from 'organization/OwnerProvider'
import logo from 'assets/images/logo.png'
import {obvioRoutes} from 'obvio/Routes'

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
  const {logout} = useOrganizationAuth()
  const history = useHistory()
  const {routes, organization} = useOrganization()
  const isOwner = useIsOwner()

  const homeLinkTarget = isOwner ? routes.settings : routes.events.root

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
          <HomeLink to={homeLinkTarget} disableStyles>
            {organization.name}
          </HomeLink>
        </div>
        <div>
          <RelativeLink to={routes.events.root} disableStyles>
            <Button startIcon={<Event />}>Events</Button>
          </RelativeLink>
          <HasPermission permission={UPDATE_TEAM}>
            <RelativeLink to={routes.team} disableStyles>
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
            <CreditsMenuItem />
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
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

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

export default function AppBar() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: '#ffffff',
    },
  }))
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useOrganizationAuth()
  const history = useHistory()
  const {routes, organization} = useOrganization()

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
      <Toolbar>
        <HomeLink to={routes.events.root} disableStyles>
          {organization.name}
        </HomeLink>
        <div>
          <RelativeLink to={routes.events.root} disableStyles>
            <Button startIcon={<Event />}>Events</Button>
          </RelativeLink>
          <RelativeLink to={routes.team} disableStyles>
            <Button startIcon={<People />}>Team</Button>
          </RelativeLink>
          <Button
            startIcon={<AccountCircle />}
            onClick={handleMenu}
            color="default"
          >
            Account
          </Button>
          <Menu
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

const HomeLink = styled(RelativeLink)`
  flex: 1;
  color: #000000;
`

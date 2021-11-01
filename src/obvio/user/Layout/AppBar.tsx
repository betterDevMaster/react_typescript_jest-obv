import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {useObvioAuth, useObvioUser} from 'obvio/auth'
import {useHistory} from 'react-router-dom'
import {obvioRoutes} from 'obvio/Routes'
import logo from 'assets/images/logo.png'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import CreditsMenuItem from 'obvio/Billing/CreditsMenuItem'
import Divider from '@material-ui/core/Divider'

export default function AppBar() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: '#ffffff',
    },
  }))
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useObvioAuth()
  const history = useHistory()
  const user = useObvioUser()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
    history.push(obvioRoutes.login)
  }

  return (
    <MuiAppBar className={classes.root}>
      <Toolbar>
        <Logo>
          <RelativeLink to={obvioRoutes.root} disableStyles>
            <img src={logo} alt="Obv.io" />
          </RelativeLink>
        </Logo>
        <div>
          <IconButton
            aria-haspopup="true"
            onClick={handleMenu}
            color="default"
            aria-label="account menu"
          >
            <AccountCircle />
          </IconButton>
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
            <UserEmail>
              <LoggedInAsLabel>Logged in as</LoggedInAsLabel>
              <br />
              {user.email}
            </UserEmail>
            <Divider />
            <CreditsMenuItem />
            <Divider />
            <RelativeLink disableStyles to={obvioRoutes.change_password}>
              <MenuItem aria-label="change password">Change Password</MenuItem>
            </RelativeLink>
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
    width: 120px;
    img {
      max-width: 100%;
    }
  }
`

const UserEmail = styled.div`
  padding: 6px 16px;
`

const LoggedInAsLabel = styled.span`
  color: ${(props) => props.theme.colors.text.muted};
  font-size: 0.75rem;
`

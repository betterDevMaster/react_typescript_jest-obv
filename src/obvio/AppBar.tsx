import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {useObvioAuth} from 'obvio/auth'
import {useHistory} from 'react-router-dom'
import {ROUTES} from 'obvio/Routes'

export default function AppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useObvioAuth()
  const history = useHistory()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
    history.push(ROUTES.login)
  }

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Title variant="h6">Obv.io</Title>
        <div>
          <IconButton aria-haspopup="true" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
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

const Title = withStyles({
  root: {
    flexGrow: 1,
  },
})(Typography)

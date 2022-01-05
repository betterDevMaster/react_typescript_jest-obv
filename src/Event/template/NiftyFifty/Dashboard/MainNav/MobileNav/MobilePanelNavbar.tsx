import React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'

import DrawerComponent from 'Event/template/NiftyFifty/Dashboard/MainNav/MobileNav/Drawer'
import {props} from 'ramda'

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: 'flex',
  },
  logo: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '20px',
    marginLeft: theme.spacing(20),
    '&:hover': {
      color: 'yellow',
      borderBottom: '1px solid white',
    },
  },
}))

export default function Navbar() {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {rightPanel} = useNiftyFiftyTemplate()

  return (
    <Paper position="static" textcolor={rightPanel.textColor}>
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          Navbar
        </Typography>
        {isMobile && <DrawerComponent />}
      </Toolbar>
    </Paper>
  )
}

const Paper = styled(AppBar)<{
  textcolor: string
}>`
  background-color: transparent;
  box-shadow: none;
  color: ${(props) => props.textcolor};
`

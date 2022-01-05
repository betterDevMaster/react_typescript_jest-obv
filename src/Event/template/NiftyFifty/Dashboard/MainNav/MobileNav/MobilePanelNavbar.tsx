import React, {useState} from 'react'
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

const useStyles = makeStyles((theme) => ({
  logo: {
    flexGrow: 1,
    cursor: 'pointer',
    fontWeight: 900,
  },
}))

export default function Navbar(props: {onChangeTab: (tab: number) => void}) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {rightPanel} = useNiftyFiftyTemplate()
  const [title, setTitle] = useState('Home')

  return (
    <Paper position="static" textcolor={rightPanel.textColor}>
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          {title}
        </Typography>
        {isMobile && (
          <DrawerComponent
            onChangeTab={props.onChangeTab}
            onChangeTitle={(t) => setTitle(t)}
          />
        )}
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

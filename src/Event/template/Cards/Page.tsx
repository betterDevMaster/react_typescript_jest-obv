import React, {useState} from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/Cards/Dashboard/Header'
import Menu from 'Event/template/Cards/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/Cards/Dashboard/Footer'
import {useCards} from 'Event/template/Cards'
import LanguageSelectMenu from 'Event/LanguageSelector'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import {ThemeProvider} from '@material-ui/core/styles'
import {withStyles} from '@material-ui/core/styles'
import {
  createMuiDarkTheme,
  createMuiLightTheme,
  MuiThemeOptions,
} from 'lib/ui/theme'
import PageLinks from 'Event/template/Cards/Dashboard/PageLinks'

export default function CardsPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {template} = useCards()

  const {isDarkMode} = template

  const theme = isDarkMode ? muiDarkTheme : muiTheme

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} />
        <Header
          menuVisible={menuVisible}
          toggleMenu={toggleMenu}
          aria-label="header"
          isDashboardHeader={false}
        />
        <Content>
          <BottomBox>
            <PageLinks />
            <StyledContainer>{props.children}</StyledContainer>
          </BottomBox>
        </Content>
        <LanguageSelectMenu />
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export function useTheme(isDarkMode?: boolean) {
  const {template} = useCards()

  const options: MuiThemeOptions = {
    secondaryColor: template.accentColor,
  }

  return isDarkMode ? createMuiDarkTheme(options) : createMuiLightTheme(options)
}

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(Container)

export const PageTitle = styled.h2`
  font-size: 28px;
  line-height: 1.5;
  font-weight: 700;
  text-transform: uppercase;
  text-align: left;
  margin: ${(props) => props.theme.spacing[8]} 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 24px;
    line-height: 1.5;
    font-weight: 700;
  }
`
export const PageDescription = styled.h2`
  font-size: 18px;
  line-height: 1.2;
  font-weight: 500;
  text-align: left;
  margin: 0 0 30px;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
  }
`

export const BottomBox = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing[10]};
`

export const Box = styled.div`
  min-height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 70px;
  display: flex;
`

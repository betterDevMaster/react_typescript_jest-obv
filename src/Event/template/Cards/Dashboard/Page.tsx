import React, {useState, useRef} from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/Cards/Dashboard/Header'
import Menu from 'Event/template/Cards/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/Cards/Dashboard/Footer'
import {Cards, useCardsTemplate} from 'Event/template/Cards'
import {rgba} from 'lib/color'
import LanguageSelectMenu from 'Event/LanguageSelector'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import {ThemeProvider} from '@material-ui/core/styles'
import {withStyles} from '@material-ui/core/styles'
import MainNav from 'Event/template/Cards/Dashboard/MainNav'
import {useRandomBackground} from 'Event/template/Cards/Login/Page'
import {
  createMuiDarkTheme,
  createMuiLightTheme,
  MuiThemeOptions,
} from 'lib/ui/theme'
import IconButton from 'lib/ui/IconButton'
import {Icon} from 'lib/fontawesome/Icon'
import {Typography} from '@material-ui/core'
import {useAttendeeVariables} from 'Event'
import Bar from 'Event/template/Cards/Dashboard/PageLinks'
import {BottomBox} from 'Event/template/Cards/Page'
import CountDownTimers from 'Event/template/Cards/Dashboard/CountDownTimers'

export default function CardsPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const template = useCardsTemplate()

  const {background, isDarkMode} = template

  const dashboardBackground = useRandomBackground()

  const backgroundRGBColor = rgba(background.color, background.opacity)

  const theme = isDarkMode ? muiDarkTheme : muiTheme

  const color = template.textColor
  const linkUnderline = template.linkUnderline
  const linkColor = template.linkColor

  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <ThemeProvider theme={theme}>
      <TopBox
        background={dashboardBackground}
        color={color}
        linkColor={linkColor}
        linkUnderline={linkUnderline}
        position={template.backgroundPosition}
      >
        <ColorOverlay color={backgroundRGBColor}>
          <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} />
          <Header
            menuVisible={menuVisible}
            toggleMenu={toggleMenu}
            aria-label="header"
            isDashboardHeader={true}
          />
          <TopContainer>
            <Top>
              <CountDownTimers />
              <MainNav />
            </Top>
            <ScrollDown contentRef={contentRef} />
          </TopContainer>
        </ColorOverlay>
      </TopBox>
      <BottomBox ref={contentRef}>
        <Bar />
        <BottomContainer>{props.children}</BottomContainer>
      </BottomBox>
      <LanguageSelectMenu />
      <Footer />
    </ThemeProvider>
  )
}

function ScrollDown(props: {contentRef: React.RefObject<HTMLDivElement>}) {
  const v = useAttendeeVariables()

  const {mainNav} = useCardsTemplate()

  const executeScroll = () => {
    if (!props.contentRef || !props.contentRef.current) {
      return
    }
    props.contentRef.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <StyledDownContainer color={mainNav.scrollDownArrowColor}>
      <AnimationIcon>
        <IconButton onClick={executeScroll}>
          <ArrowIcon
            iconClass={`far fa-angle-down`}
            color={mainNav.scrollDownArrowColor}
          />
        </IconButton>
      </AnimationIcon>
      <Typography>{v(mainNav.scrollDownText)}</Typography>
    </StyledDownContainer>
  )
}

export function useTheme(isDarkMode?: boolean) {
  const template = useCardsTemplate()

  const options: MuiThemeOptions = {
    secondaryColor: template.accentColor,
  }

  return isDarkMode ? createMuiDarkTheme(options) : createMuiLightTheme(options)
}

export const TopBox = styled.div<{
  background: string | null
  color: string
  linkColor: string
  linkUnderline: boolean
  position: Cards['backgroundPosition']
}>`
  height: auto;
  font-family: Arial, 'Times New Roman', Verdana;
  font-size: 17px;
  color: ${(props) => props.color};
  ${(props) =>
    props.background ? `background: url(${props.background});` : ''}
  ${(props) =>
    props.position === 'bottom' &&
    `
      background-position: bottom;
      background-size: cover;
    `}
  ${(props) =>
    props.position === 'fixed' &&
    `
      background-position: bottom;
      background-attachment: fixed;
      background-size: cover;
    `}
  background-repeat: no-repeat;

  a {
    color: ${(props) => props.linkColor};
    text-decoration: none;

    &:hover {
      text-decoration: ${(props) =>
        props.linkUnderline ? 'underline' : 'none'};
    }
  }
  -webkit-transition: all 300ms ease-in 200ms;
  -moz-transition: all 300ms ease-in 200ms;
  -o-transition: all 300ms ease-in 200ms;
  transition: all 300ms ease-in 200ms;
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 100vh;
`

const TopContainer = withStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})(Container)

const BottomContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})(Container)

const ArrowIcon = styled(Icon)`
  font-size: 60px;
  margin: 0 2px;
`

const AnimationIcon = styled.div`
  -webkit-animation: mover 1s infinite alternate;
  animation: mover 1s infinite alternate;

  @-webkit-keyframes mover {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
    }
  }
  @keyframes mover {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
    }
  }
`

const StyledDownContainer = styled.div<{color: string}>`
  text-align: center;
  margin-bottom: 20px;
  color: ${(props) => props.color};
`

const Top = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

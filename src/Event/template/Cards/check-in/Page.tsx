import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import Footer from 'Event/template/Cards/Dashboard/Footer'
import {useCardsTemplate} from 'Event/template/Cards'
import {rgba} from 'lib/color'
import LanguageSelectMenu from 'Event/LanguageSelector'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import {ThemeProvider} from '@material-ui/core/styles'
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Logo from 'Event/template/Cards/Login/Logo'
import {useRandomBackground} from 'Event/template/Cards/Login/Page'
import {TopBox} from 'Event/template/Cards/Dashboard/Page'

export default function CheckInPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const template = useCardsTemplate()

  const {background, isDarkMode} = template

  const dashboardBackground = useRandomBackground()

  const backgroundRGBColor = rgba(background.color, background.opacity)

  const theme = isDarkMode ? muiDarkTheme : muiTheme

  const color = template.textColor
  const linkUnderline = template.linkUnderline
  const linkColor = template.linkColor

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
          <Content>
            <Logo />
            <StyledContainer maxWidth="lg">
              <StyledPaper>{props.children}</StyledPaper>
            </StyledContainer>
          </Content>
          <LanguageSelectMenu />
          <Footer />
        </ColorOverlay>
      </TopBox>
    </ThemeProvider>
  )
}

const Content = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    display: block;
  }
`
const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})(Container)

const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing[10]};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
`

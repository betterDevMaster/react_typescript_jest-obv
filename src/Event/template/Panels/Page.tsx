import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import {rgba} from 'lib/color'
import {ThemeProvider} from '@material-ui/core/styles'
import {Panels, usePanels} from 'Event/template/Panels'
import Hidden from '@material-ui/core/Hidden'
import {
  createMuiDarkTheme,
  createMuiLightTheme,
  MuiThemeOptions,
} from 'lib/ui/theme'

const DEFAULT_BACKGROUND_COLOR = '#FFFFFF'

export default function Page(props: {
  Left: React.ReactElement
  Right: React.ReactElement
  Mobile: React.ReactElement
}) {
  const {Left, Right, Mobile} = props
  const {
    template: {linkUnderline, backgroundPosition, isDarkMode},
  } = usePanels()

  const background = useBackground()
  const backgroundColor = useBackgroundColor()
  const textColor = useTextColor()
  const linkColor = useLinkColor()
  const theme = useTheme(isDarkMode)

  return (
    <ThemeProvider theme={theme}>
      <Box
        background={background}
        backgroundPosition={backgroundPosition}
        linkUnderline={linkUnderline}
        linkColor={linkColor}
        color={textColor}
      >
        <ColorOverlay color={backgroundColor}>
          <Hidden smDown>
            <FullHeightGrid container>
              <SidePanel item md={4} xs={12}>
                {Left}
              </SidePanel>
              <SidePanel item md={8} xs={12}>
                {Right}
              </SidePanel>
            </FullHeightGrid>
          </Hidden>
          <Hidden mdUp>{Mobile}</Hidden>
        </ColorOverlay>
      </Box>
    </ThemeProvider>
  )
}

function useBackground() {
  const {event} = useEvent()

  if (!event.dashboard_background) {
    return ''
  }

  return `background: url(${event.dashboard_background.url})`
}

function useBackgroundColor() {
  const {
    template: {background},
  } = usePanels()

  if (!background || !background.color) {
    return DEFAULT_BACKGROUND_COLOR
  }

  const opacity = background.opacity || 0
  return rgba(background.color, opacity)
}

function useTextColor() {
  const {
    template: {isDarkMode},
  } = usePanels()

  return isDarkMode ? '#FFFFFF' : '#000000'
}

function useLinkColor() {
  const {
    template: {linkColor},
  } = usePanels()

  const textColor = useTextColor()

  if (!linkColor) {
    return textColor
  }

  return linkColor
}

export function useTheme(isDarkMode?: boolean) {
  const {template} = usePanels()

  const options: MuiThemeOptions = {
    secondaryColor: template.accentColor,
  }

  return isDarkMode ? createMuiDarkTheme(options) : createMuiLightTheme(options)
}

const Box = styled.div<{
  background: string
  backgroundPosition: Panels['backgroundPosition']
  color: string
  linkUnderline?: boolean
  linkColor: string
}>`
  ${(props) => props.background};
  font-size: 17px;
  color: ${(props) => props.color};
  min-height: 100vh;
  background-size: cover;

  a {
    color: ${(props) => props.linkColor};
    text-decoration: none;

    &:hover {
      text-decoration: ${(props) =>
        props.linkUnderline ? 'underline' : 'none'};
    }
  }

  p {
    margin-top: 0;
  }

  /* Background */
  ${(props) =>
    props.backgroundPosition === 'bottom' &&
    `
      background-position: bottom;
    `}
  ${(props) =>
    props.backgroundPosition === 'fixed' &&
    `
      background-position: bottom;
      background-attachment: fixed;
    `}
  background-repeat: no-repeat;
  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    background-repeat: repeat-y;
  }
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  height: 100vh;

  display: flex;

  > * {
    flex: 1;
  }
`

export const PageTitle = styled.h2`
  font-size: 28px;
  line-height: 1.5;
  font-weight: 700;
  text-transform: uppercase;
  text-align: left;
  margin: 0 0 30px;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 24px;
    line-height: 1.5;
    font-weight: 700;
  }
`

const FullHeightGrid = styled(Grid)`
  height: 100vh;
`

const SidePanel = styled(FullHeightGrid)`
  display: flex;
  overflow: hidden;

  > * {
    flex: 1;
  }
`

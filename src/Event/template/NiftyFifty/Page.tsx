import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import {safeColor, rgba} from 'lib/color'
import {ThemeProvider} from '@material-ui/core/styles'
import {NiftyFifty, useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import Hidden from '@material-ui/core/Hidden'
import {
  createMuiDarkTheme,
  createMuiLightTheme,
  MuiThemeOptions,
} from 'lib/ui/theme'
import LanguageSelector from 'Event/LanguageSelector'

const DEFAULT_BACKGROUND_COLOR = '#FFFFFF'
export const TOP_BAR_HEIGHT = 65

export default function Page(props: {
  Left: React.ReactElement
  Right: React.ReactElement
  Mobile: React.ReactElement
}) {
  const {Left, Right, Mobile} = props
  const {
    linkUnderline,
    backgroundPosition,
    isDarkMode,
  } = useNiftyFiftyTemplate()

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
            <Grid container>
              <Grid item md={6} xs={12}>
                {Left}
              </Grid>
              <Grid item md={6} xs={12}>
                {Right}
              </Grid>
            </Grid>
          </Hidden>
          <Hidden mdUp>{Mobile}</Hidden>
          <LanguageSelector />
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
  const {background} = useNiftyFiftyTemplate()

  if (!background || !background.color) {
    return DEFAULT_BACKGROUND_COLOR
  }

  const opacity = background.opacity || 0
  return rgba(background.color, opacity)
}

function useTextColor() {
  const {isDarkMode} = useNiftyFiftyTemplate()

  return isDarkMode ? '#FFFFFF' : '#000000'
}

function useLinkColor() {
  const {linkColor} = useNiftyFiftyTemplate()

  const textColor = useTextColor()

  if (!linkColor) {
    return textColor
  }

  return linkColor
}

export function useTheme(isDarkMode?: boolean) {
  const template = useNiftyFiftyTemplate()

  // Material-UI: Unsupported color names.
  // Material-UI supports the following formats: #fff, #ffffff, rgb(), rgba(), hsl(), hsla()
  const options: MuiThemeOptions = {
    secondaryColor: safeColor(template.accentColor),
  }

  return isDarkMode ? createMuiDarkTheme(options) : createMuiLightTheme(options)
}

const Box = styled.div<{
  background: string
  backgroundPosition: NiftyFifty['backgroundPosition']
  color: string
  linkUnderline?: boolean
  linkColor: string
}>`
  ${(props) => props.background};
  font-size: 17px;
  color: ${(props) => props.color};
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
  width: 100%;
  height: 100%;
  /* Background */
  background-size: cover;
  background-repeat: no-repeat;
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
  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    background-repeat: repeat-y;
  }
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  width: 100%;
  min-height: 100vh;
  display: flex;
`

export const PageTitle = styled.h2<{
  color?: string
  size?: number
}>`
  font-size: 28px;
  line-height: 1.5;
  font-weight: 700;
  text-transform: uppercase;
  text-align: left;
  margin: 0 0 10px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 24px;
    line-height: 1.5;
    font-weight: 700;
  }
`

export const PageDescription = styled.h2<{
  color?: string
}>`
  font-size: 18px;
  line-height: 1.2;
  font-weight: 500;
  text-align: left;
  margin: 0 0 10px;
  color: ${(props) => props.color};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
  }
`

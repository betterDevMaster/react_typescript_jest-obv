import {createMuiTheme, ThemeOptions} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

export const breakpoints = {
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
}

export const colors = {
  primary: '#3490DC',
  secondary: '#2066a7',
  success: '#20A746',
  border: '#a0a9b0',
  info: '#51EA0A',
  error: red[500],
  warning: '#ffc107',
  text: {
    muted: '#606F7B',
  },
  accent: '#a72020',
  gray: '#f1f1f1',
  gray100: '#a7a7a7',
  gray200: '#838383',
  gray300: '#dfdfdf',
  gray400: '#4f4f4f',
  blue: '#2794d2',
  disabled: '#c4c4c4',
}

export const spacing = Array(60)
  .fill(4)
  .map((base, idx) => `${base * idx}px`)

const muiBaseTheme: ThemeOptions = {
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: spacing[4],
      },
    },
    MuiButton: {
      outlined: {
        border: '1px solid #000000',
      },
    },
  },
}

export const muiTheme = createMuiTheme(
  {
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
    },

    typography: {
      fontFamily: [
        'Rubik',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  },
  muiBaseTheme,
)

export const muiDarkTheme = createMuiTheme(
  {
    palette: {
      type: 'dark',
      primary: {
        main: '#FFFFFF',
      },
    },
  },
  muiBaseTheme,
)

export type MuiThemeOptions = {
  secondaryColor: string
}

export const createMuiDarkTheme = (options: MuiThemeOptions) =>
  createMuiTheme(
    {
      palette: {
        type: 'dark',
        primary: {
          main: '#FFFFFF',
        },
        secondary: {
          main: options.secondaryColor || colors.secondary,
        },
      },
    },
    muiBaseTheme,
  )

export const createMuiLightTheme = (options: MuiThemeOptions) =>
  createMuiTheme(
    {
      palette: {
        primary: {
          main: colors.primary,
        },
        secondary: {
          main: options.secondaryColor || colors.secondary,
        },
      },
    },
    muiBaseTheme,
  )

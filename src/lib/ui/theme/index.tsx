import {createMuiTheme} from '@material-ui/core/styles'
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
  border: '#e2e2e2',
  error: red[500],
  text: {
    muted: '#B1B1B1',
  },
}

export const spacing = Array(60)
  .fill(4)
  .map((base, idx) => `${base * idx}px`)

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: spacing[4],
      },
    },
    MuiInputLabel: {
      shrink: {
        background: '#FFFFFF',
      },
    },
  },
})

export const muiDarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: spacing[4],
      },
    },
  },
})

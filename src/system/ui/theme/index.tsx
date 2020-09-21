import {createMuiTheme} from '@material-ui/core/styles'

export const breakpoints = {
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
}

export const spacing = Array(60)
  .fill(4)
  .map((base, idx) => `${base * idx}px`)

export const muiTheme = createMuiTheme({})
import {makeStyles} from '@material-ui/core/styles'

export const animationStyles = makeStyles(({palette, ...theme}) => ({
  '@global': {
    '.fade-in': {
      animation: 'fade-in 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
    },
    '@keyframes fade-in': {from: {opacity: '0'}, to: {opacity: '1'}},
  },
}))

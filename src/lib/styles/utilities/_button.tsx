import {makeStyles} from '@material-ui/core/styles'

export const buttonStyles = makeStyles(({palette, ...theme}) => ({
  '@global': {
    '.btn-icon-only': {width: '2.375rem', height: '2.375rem', padding: '0'},
    '.btn-icon-only:hover': {
      backgroundColor: '#9e9e9e !important',
    },
    '.btn-facebook': {
      color: '#fff',
      borderColor: '#3b5999',
      backgroundColor: '#3b5999',
      boxShadow: '0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%)',
    },
    '.btn-twitter': {
      color: '#fff',
      borderColor: '#1da1f2',
      backgroundColor: '#1da1f2',
      boxShadow: '0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%)',
    },
    '.btn-google-plus': {
      color: '#fff',
      borderColor: '#dd4b39',
      backgroundColor: '#dd4b39',
      boxShadow: '0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%)',
    },
  },
}))

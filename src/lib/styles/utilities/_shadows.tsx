import {makeStyles} from '@material-ui/core/styles'

export const shadowStyles = makeStyles(({palette, ...theme}) => ({
  '@global': {
    ...generateShadows(theme),
  },
}))
interface ClassObject {
  [key: string]: any
}

const generateShadows = (theme: any) => {
  let classList: ClassObject = {}

  theme.shadows.forEach((shadow: any, ind: any) => {
    classList[`.elevation-z${ind}`] = {
      boxShadow: `${shadow} !important`,
    }
  })

  return classList
}

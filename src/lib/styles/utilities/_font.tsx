import {makeStyles} from '@material-ui/core/styles'

export const fontStyles = makeStyles(({palette, ...theme}) => ({
  '@global': {
    ...generateFontWeight(1, 7),
    ...generateFontSize(1, 100),
  },
}))

interface ClassObject {
  [key: string]: any
}

const generateFontWeight = (start: number, end: number) => {
  let classList: ClassObject = {}

  for (let i = start; i <= end; i++) {
    classList[`.f-weight-${i * 100}`] = {
      fontWeight: `${i * 100} !important`,
    }
  }

  return classList
}

const generateFontSize = (start: number, end: number) => {
  let classList: ClassObject = {}
  let units = ['px', 'em', 'rem']
  for (let i = start; i <= end; i++) {
    for (let j = 0; j <= units.length; j++) {
      classList[`.f-size-${i}-${units[j]}`] = {
        fontSize: `${i}${units[j]} !important`,
      }
    }
  }
  return classList
}

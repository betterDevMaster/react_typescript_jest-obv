import {variableStyles} from './_variables'
import {positioningStyles} from './utilities/_positionings'
import {spacingStyles} from './utilities/_spacing'
import {borderStyles} from './utilities/_border'
import {shadowStyles} from './utilities/_shadows'
import {colorStyles} from './utilities/_color'
import {buttonStyles} from './utilities/_button'
import {typographyStyles} from './utilities/_typography'
import {commonStyles} from './utilities/_common'
import {animationStyles} from './utilities/_animations'
import {fontStyles} from './utilities/_font'

export default function GlobalCss() {
  variableStyles()
  positioningStyles()
  spacingStyles()
  borderStyles()
  colorStyles()
  buttonStyles()
  shadowStyles()
  typographyStyles()
  commonStyles()
  animationStyles()
  fontStyles()

  return null
}

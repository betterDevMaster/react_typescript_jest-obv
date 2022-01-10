import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import InputLabel from '@material-ui/core/InputLabel'

const Label = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

export default Label

import Button, {ButtonProps} from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import red from '@material-ui/core/colors/red'

export default function DangerButton(
  props: ButtonProps & {className?: string},
) {
  const isContained = props.variant === 'contained'

  const hoverBackground = () => {
    if (isContained) {
      return red[700]
    }

    return 'transparent'
  }
  const classes = makeStyles({
    root: {
      color: isContained ? '#FFFFFF' : red[500],
      borderColor: isContained ? red[500] : red[300],
      background: isContained ? red[500] : 'transparent',
      display: props.hidden ? 'none' : 'flex',
      '&:hover': {
        backgroundColor: hoverBackground(),
        borderColor: red[500],
      },
    },
  })()

  const classNames = props.className
    ? `${classes.root} ${props.className}`
    : classes.root

  return <Button {...props} className={classNames}></Button>
}

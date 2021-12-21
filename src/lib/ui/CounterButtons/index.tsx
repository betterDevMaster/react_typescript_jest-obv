import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {makeStyles} from '@material-ui/styles'
import {spacing} from 'lib/ui/theme'
import {colors} from 'lib/ui/theme'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_CURRENT = 0

interface CounterButtonsProps {
  min?: number
  max?: number
  current?: number
  orientation?: 'vertical' | 'horizontal'
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained'
  hasBorder?: boolean
  displayColor?: 'primary' | 'danger' | 'default'
  decreaseButtonColor?: 'primary' | 'secondary' | 'default'
  increaseButtonColor?: 'primary' | 'secondary' | 'default'
  fullWidth?: boolean
  onChange: (val: number) => {}
}
export default function CounterButtons(props: CounterButtonsProps) {
  const [current, setCurrent] = useState(props.current || DEFAULT_CURRENT)

  const handleIncrement = () => {
    const val = current + 1
    if (val > (props.max || DEFAULT_MAX)) {
      return
    }

    setCurrent(val)
    props.onChange(val)
  }

  const handleDecrement = () => {
    const val = current - 1
    if (val < (props.min || DEFAULT_MIN)) {
      return
    }
    setCurrent(val)
    props.onChange(val)
  }

  const useStyles = makeStyles({
    root: {
      border: props.hasBorder ? '1px solid #DFDFDF' : '',
      padding: spacing[1],
      '& > .Mui-disabled': {
        backgroundColor: 'transparent',
        color: getColor(props),
      },
    },
  })

  const classes = useStyles()

  return (
    <ButtonGroup
      size={props.size}
      aria-label="small outlined button group"
      variant={props.variant}
      color="primary"
      orientation={props.orientation}
      className={classes.root}
    >
      <Button onClick={handleDecrement} color={props.decreaseButtonColor}>
        -
      </Button>
      <Button disabled fullWidth>
        {current}
      </Button>
      <Button onClick={handleIncrement} color={props.increaseButtonColor}>
        +
      </Button>
    </ButtonGroup>
  )
}

function getColor(props: CounterButtonsProps) {
  if (props.displayColor === 'danger') {
    return colors.error
  }

  if (props.displayColor === 'primary') {
    return colors.primary
  }

  return '#000000'
}

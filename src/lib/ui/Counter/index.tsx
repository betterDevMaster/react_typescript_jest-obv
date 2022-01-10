import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {makeStyles} from '@material-ui/styles'
import {colors} from 'lib/ui/theme'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_CURRENT = 0

interface CounterProps {
  min?: number
  max?: number
  current?: number
  orientation?: 'vertical' | 'horizontal'
  size?: 'small' | 'medium' | 'large'
  hasBorder?: boolean
  displayColor?: 'primary' | 'danger' | 'default'
  onChange?: (val: number) => void
}
export default function Counter(props: CounterProps) {
  const [current, setCurrent] = useState(props.current || DEFAULT_CURRENT)

  const handleIncrement = () => {
    const val = current + 1
    if (val > (props.max || DEFAULT_MAX)) {
      return
    }

    setCurrent(val)
    if (props.onChange) {
      props.onChange(val)
    }
  }

  const handleDecrement = () => {
    const val = current - 1
    if (val < (props.min || DEFAULT_MIN)) {
      return
    }
    setCurrent(val)
    if (props.onChange) {
      props.onChange(val)
    }
  }

  const useStyles = makeStyles({
    root: {
      border: props.hasBorder ? '1px solid #DFDFDF' : '',
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
      variant="contained"
      color="primary"
      orientation={props.orientation}
      className={classes.root}
    >
      <Button onClick={handleDecrement}>-</Button>
      <Button disabled fullWidth>
        {current}
      </Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  )
}

function getColor(props: CounterProps) {
  if (props.displayColor === 'danger') {
    return colors.error
  }

  if (props.displayColor === 'primary') {
    return colors.primary
  }

  return '#000000'
}

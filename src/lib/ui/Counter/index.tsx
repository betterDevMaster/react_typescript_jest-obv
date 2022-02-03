import React, {useState} from 'react'
import Button from 'lib/ui/Button'
import {PlusIcon, MinusIcon} from 'lib/ui/Icon'
import styled from 'styled-components'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_CURRENT = 0

interface CounterProps {
  min?: number
  max?: number
  current?: number
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

  return (
    <Container>
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleDecrement}
        disablePadding
      >
        <MinusIcon />
      </StyledButton>
      <Label>{current}</Label>
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleIncrement}
        disablePadding
      >
        <PlusIcon />
      </StyledButton>
    </Container>
  )
}

const StyledButton = styled(Button)`
  padding: ${(props) => props.theme.spacing[2]};
`
const Container = styled.div`
  display: inline-flex;
  padding: ${(props) => props.theme.spacing[2]};
  border-radius: 4px;
  border: 1px solid #e7e7e7;
`
const Label = styled.span`
  width: 45px;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

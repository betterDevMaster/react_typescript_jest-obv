import {grey} from '@material-ui/core/colors'
import React from 'react'
import styled from 'styled-components'

export default function IconButton(props: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  children: React.ReactElement
  dataTestId?: string
  className?: string
  'aria-label'?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const color = useColor(props)

  return (
    <Button
      type={props.type || 'button'}
      className={props.className}
      onClick={props.onClick}
      data-testid={props.dataTestId}
      aria-label={props['aria-label']}
      disabled={props.disabled}
      color={color}
    >
      {props.children}
    </Button>
  )
}

function useColor(props: {disabled?: boolean}) {
  if (props.disabled) {
    return grey[500]
  }

  return undefined
}

const Button = styled.button<{color?: string}>`
  cursor: pointer;
  position: relative;
  display: inline-flex;
  border: 0;
  background: 0;
  padding: 0;
  line-height: 1;

  svg {
    ${(props) => (props.color ? `color: ${props.color};` : '')};
  }
`

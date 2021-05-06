import React from 'react'
import styled from 'styled-components'

export default function IconButton(props: {
  onClick?: () => void
  children: React.ReactElement
  dataTestId?: string
  className?: string
  'aria-label'?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <Button
      type={props.type || 'button'}
      className={props.className}
      onClick={props.onClick}
      data-testid={props.dataTestId}
      aria-label={props['aria-label']}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  )
}

const Button = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-flex;
  border: 0;
  background: 0;
  padding: 0;
  line-height: 1;
`

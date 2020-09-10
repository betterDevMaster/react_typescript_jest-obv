import React from 'react'
import styled from 'styled-components'
import Button from 'ui/button/Button'
import {Column} from 'ui/layout'

export interface NavButton {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  newTab?: boolean
  ariaLabel?: string
  className?: string
}

export type NavButtonWithSize = NavButton & {
  size?: Column
}

export default function NavButton(props: NavButton) {
  const target = props.newTab
    ? {
        target: '_blank',
        rel: 'noopener',
      }
    : null

  return (
    <a href={props.link} {...target} aria-label={props.ariaLabel}>
      <StyledButton
        fullWidth
        textTransform="uppercase"
        backgroundColor={props.backgroundColor}
        textColor={props.textColor}
        className={props.className}
      >
        {props.text}
      </StyledButton>
    </a>
  )
}

const StyledButton = styled(Button)`
  transition: opacity 0.2s ease-in-out;
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

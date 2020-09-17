import React from 'react'
import styled from 'styled-components'
import Button from 'system/ui/button/Button'
import {Column} from 'system/ui/layout'

export interface NavButton {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  newTab?: boolean
  ariaLabel?: string
  className?: string
  hoverBackgroundColor?: string
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
        hoverBackgroundColor={props.hoverBackgroundColor}
        lightOnHover={!props.hoverBackgroundColor}
      >
        {props.text}
      </StyledButton>
    </a>
  )
}

const StyledButton = styled(Button)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

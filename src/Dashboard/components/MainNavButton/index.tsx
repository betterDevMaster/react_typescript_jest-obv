import React from 'react'
import styled from 'styled-components'
import Button from 'ui/button/Button'
import {Column} from 'ui/layout'

export default interface MainNavButton {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  newTab?: boolean
  size?: Column
}

type Props = Omit<MainNavButton, 'size'>

export default function MainNavButton(props: Props) {
  const target = props.newTab
    ? {
        target: '_blank',
        rel: 'noopener',
      }
    : null

  return (
    <a href={props.link} {...target} aria-label="main nav button">
      <StyledButton fullWidth textTransform="uppercase">
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

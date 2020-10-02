import {Component} from 'Dashboard/components'
import React from 'react'
import styled from 'styled-components'
import Button from 'lib/ui/Button'
import {Column} from 'lib/ui/layout'
import {newTabProps} from 'lib/link'

export const NAV_BUTTON = 'NAV_BUTTON'

export interface NavButton extends Component {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  newTab?: boolean
  ariaLabel?: string
  className?: string
  hoverBackgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  hoverBorderColor?: string
}

export type NavButtonWithSize = NavButton & {
  size?: Column
}

export default function NavButton(
  props: NavButton & {
    id: string
  },
) {
  const tabProps = props.newTab ? newTabProps : null

  return (
    <Link href={props.link} {...tabProps} aria-label={props.ariaLabel}>
      <StyledButton
        fullWidth
        textTransform="uppercase"
        backgroundColor={props.backgroundColor}
        textColor={props.textColor}
        className={props.className}
        hoverBackgroundColor={props.hoverBackgroundColor}
        lightOnHover={!props.hoverBackgroundColor}
        borderRadius={props.borderRadius}
        borderWidth={props.borderWidth}
        borderColor={props.borderColor}
      >
        {props.text}
      </StyledButton>
    </Link>
  )
}

const Link = styled.a`
  display: flex;

  &:hover {
    text-decoration: none;
  }
`

const StyledButton = styled(Button)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

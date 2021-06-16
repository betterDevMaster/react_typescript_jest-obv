import React from 'react'
import styled, {css} from 'styled-components'
import IconButton from 'lib/ui/IconButton'
import {DEFAULT_MENU_ICON_COLOR} from 'Event/template/SimpleBlog/Menu'

export function MenuIconButton(props: {
  'aria-label'?: string
  active: boolean
  onClick?: () => void
  iconColor?: string
  className?: string
}) {
  const color = props.iconColor || DEFAULT_MENU_ICON_COLOR

  return (
    <StyledIconButton
      onClick={props.onClick}
      aria-label={props['aria-label']}
      dataTestId="menu-button"
      className={props.className}
    >
      <Bar color={color} active={props.active} />
    </StyledIconButton>
  )
}

const StyledIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  top: 50%;
  transform: translateY(-50%);
`

const barStyles = css`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  content: '';
  height: 4px;
  transition: all 0.5s;
  width: 100%;
`

const Bar = styled.div<{color: string; active: boolean}>`
  ${barStyles}
  margin-top: 0;
  background: ${(props) => (props.active ? 'transparent' : props.color)};

  &:before {
    ${barStyles}
    margin-top: ${(props) => (props.active ? '0' : '-8px')};
    background: ${(props) => props.color};
    transform: ${(props) =>
      props.active ? 'rotate(-45deg)' : 'rotate(0), translateY(-50%)'};
  }

  &:after {
    ${barStyles}
    margin-top: ${(props) => (props.active ? '0' : '8px')};
    background: ${(props) => props.color};
    transform: ${(props) =>
      props.active ? 'rotate(45deg)' : 'rotate(0), translateY(-50%)'};
  }
`

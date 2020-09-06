import React from 'react'
import styled, {css} from 'styled-components'

export function MenuIconButton(props: {
  active: boolean
  onClick?: () => void
  color: string
}) {
  return (
    <Box>
      <Bar color={props.color} active={props.active} />
    </Box>
  )
}

const Box = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  top: 50%;
  transform: translateY(-50%);
  position: relative;
`

const barStyles = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  content: '';
  height: 4px;
  transition: all 0.5s;
  width: 100%;
`

const Bar = styled.div<{color: string; active: boolean}>`
  ${barStyles}
  margin-top: 0;
  background: ${(props) => (props.active ? '#fff' : props.color)};

  &:before {
    ${barStyles}
    margin-top: ${(props) => (props.active ? '0' : '-8px')};
    background: ${(props) => (props.active ? '#000' : props.color)};
    transform: ${(props) =>
      props.active ? 'rotate(-45deg)' : 'rotate(0), translateY(-50%)'};
  }

  &:after {
    ${barStyles}
    margin-top: ${(props) => (props.active ? '0' : '8px')};
    background: ${(props) => (props.active ? '#000' : props.color)};
    transform: ${(props) =>
      props.active ? 'rotate(45deg)' : 'rotate(0), translateY(-50%)'};
  }
`

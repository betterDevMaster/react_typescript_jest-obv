import {useCards} from 'Event/template/Cards'
import React from 'react'
import styled from 'styled-components'

export default function Heading(props: {
  children: string
  'aria-label'?: string
}) {
  const {template} = useCards()
  const {sidebar} = template
  return (
    <StyledContainer
      color={sidebar.headBackgroundColor}
      border={sidebar.headBackgroundBorder}
    >
      <Text aria-label={props['aria-label']} color={sidebar.headTextColor}>
        {props.children}
      </Text>
    </StyledContainer>
  )
}

const Text = styled.h2<{color: string}>`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.color};
  text-align: center;
  &:empty {
    width: ${(props) => props.theme.spacing[14]};
    height: ${(props) => props.theme.spacing[8]};
  }
`
const StyledContainer = styled.div<{color?: string; border?: number}>`
  background-color: ${(props) => props.color};
  border-radius: ${(props) => props.border}px ${(props) => props.border}px 0px
    0px;
  margin-left: -${(props) => props.theme.spacing[8]};
  margin-right: -${(props) => props.theme.spacing[8]};
`

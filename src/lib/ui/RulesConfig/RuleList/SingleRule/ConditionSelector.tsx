import React from 'react'
import styled from 'styled-components'

import {Rule} from 'lib/ui/RulesConfig'
import Button from 'lib/ui/Button'

export default function ConditionSelector(props: {
  visible: boolean
  rule: Rule
  className?: string
}) {
  if (!props.visible) {
    return null
  }

  return (
    <Container>
      <VerticalLineContainer>
        <Line isTopLine />
        <ConditionContainer>{props.rule.condition}</ConditionContainer>
        <Line />
      </VerticalLineContainer>
      <ButtonContainer>
        <Button color="primary" variant="text" disablePadding fontSize={14}>
          Clone
        </Button>
        <Button color="primary" variant="text" disablePadding fontSize={14}>
          Delete
        </Button>
      </ButtonContainer>
    </Container>
  )
}

const Line = styled.div<{isTopLine?: boolean}>`
  border-left: 1px solid #a3a3a3;
  height: 11px;
  margin: 35px;
  margin-top: ${(props) => (props.isTopLine ? 'unset' : '5px')};
  margin-bottom: ${(props) => (props.isTopLine ? '5px' : 'unset')};
`
const ConditionContainer = styled.div`
  padding: ${(props) => `0 ${props.theme.spacing[5]}`};
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 35px;
`

const VerticalLineContainer = styled.div`
  width: 65%;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 100px;
`
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

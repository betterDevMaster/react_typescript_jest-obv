import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import React from 'react'
import {SvgIconTypeMap} from '@material-ui/core'

export default function DeleteButton(props: {rule: Rule}) {
  const {rule} = props
  const {remove, processing} = useRules()

  const color: SvgIconTypeMap['props']['color'] = processing
    ? 'disabled'
    : 'error'

  return (
    <StyledIconButton
      onClick={() => remove(rule)}
      disabled={processing}
      aria-label="remove rule"
    >
      <CloseIcon color={color} />
    </StyledIconButton>
  )
}

const StyledIconButton = styled(IconButton)`
  padding: 0;
  background: transparent;

  &:hover {
    opacity: 0.6;
  }
`

import {Icon} from 'lib/fontawesome/Icon'
import React from 'react'
import styled from 'styled-components'

export default function PaidIcon(props: {paid: boolean}) {
  if (props.paid) {
    return <CheckIcon iconClass="fas fa-check" />
  }

  return <WarningIcon iconClass="far fa-exclamation-triangle" />
}

const WarningIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.error};
`

const CheckIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.success};
`

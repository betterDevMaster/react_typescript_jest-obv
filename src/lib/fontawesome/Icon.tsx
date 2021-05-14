import React from 'react'
import styled from 'styled-components'

export function Icon(props: {
  className?: string
  iconClass?: string | null
  color?: string
}) {
  const {iconClass, color, className} = props

  if (!iconClass) {
    return null
  }

  return <StyledIcon color={color} className={`${iconClass} ${className}`} />
}

const StyledIcon = styled((props) => {
  const {color, icon, ...otherProps} = props
  return <i {...otherProps} />
})`
  color: ${(props) => props.color || '#000000'};
`

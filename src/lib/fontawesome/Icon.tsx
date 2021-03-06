import React from 'react'
import styled from 'styled-components'
import {parseFileLocation} from 'lib/url'

export type IconProps = {
  className?: string
  iconClass?: string | null
  color?: string
}

export function Icon(props: IconProps) {
  const {iconClass, color, className} = props

  if (!iconClass) {
    return null
  }

  const isImage = iconClass?.startsWith('url')

  if (!isImage) {
    return <StyledIcon color={color} className={`${iconClass} ${className}`} />
  }

  const image = parseFileLocation(iconClass)

  return (
    <img src={image?.url} alt={image?.name || ''} className={props.className} />
  )
}

const StyledIcon = styled((props) => {
  const {color: _1, icon: _2, ...otherProps} = props
  return <i {...otherProps} />
})`
  color: ${(props) => props.color || '#000000'};
`

import React from 'react'
import styled from 'styled-components'
import {colors} from 'lib/ui/theme'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import {Text} from 'lib/ui/typography'

export type ItemMenuOptionProps = {
  icon?: string
  alt?: string
  color?: string
  className?: string
  name: string
  onClick?: () => void
}

export default function ItemMenuOption(props: ItemMenuOptionProps) {
  const {icon, alt, className, name, onClick} = props

  const MenuIcon = () => {
    if (icon) {
      return <img src={icon} alt={alt} />
    }
    return null
  }

  return (
    <MenuItem className={className} onClick={onClick}>
      <OptionInner>
        <MenuIcon />
        <MenuText menucolor={getColor(props)}>{name}</MenuText>
      </OptionInner>
    </MenuItem>
  )
}

function getColor(props: ItemMenuOptionProps) {
  if (props.color === 'danger') {
    return colors.error
  }
  if (props.color === 'primary') {
    return colors.primary
  }
  if (props.color === 'success') {
    return colors.success
  }
  if (props.color === 'info') {
    return colors.info
  }
  if (props.color === 'warning') {
    return colors.warning
  }
  if (props.color === 'secondary') {
    return colors.secondary
  }
  if (props.color === 'accent') {
    return colors.accent
  }
  if (props.color === 'light') {
    return '#FFFFFF'
  }
  if (props.color === 'dark') {
    return '#000000'
  }

  return colors.gray400
}

const OptionInner = styled(Box)`
  display: flex;
  align-items: center;
  img {
    width: 15px;
    height: 15px;
    margin-right: ${(props) => props.theme.spacing[2]} !important;
  }
`

const MenuText = styled(Text)<{menucolor: string}>`
  font-weight: normal !important;
  color: ${(props) => props.menucolor} !important;
`

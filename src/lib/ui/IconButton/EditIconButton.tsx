import React from 'react'
import styled, {useTheme} from 'styled-components'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from 'lib/ui/IconButton'

export default function EditIconButton(props: {
  onClick?: () => {}
  className?: string
  color?: string
}) {
  const theme = useTheme()
  const color = props.color || theme.colors.primary

  return (
    <IconButton className={props.className}>
      <StyledSettingsIcon color={color} />
    </IconButton>
  )
}

const StyledSettingsIcon = styled((props: {color: string}) => {
  const {color, ...otherProps} = props

  return <SettingsIcon {...otherProps} />
})`
  color: ${(props) => props.color};
`

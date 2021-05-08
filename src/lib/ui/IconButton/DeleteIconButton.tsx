import React from 'react'
import styled, {useTheme} from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import grey from '@material-ui/core/colors/grey'

type DeleteIconButtonProps = {
  onClick?: () => void
  className?: string
  color?: string
  'aria-label'?: string
  disabled?: boolean
}

export default function DeleteIconButton(props: DeleteIconButtonProps) {
  const color = useColor(props)

  return (
    <IconButton
      className={props.className}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      disabled={props.disabled}
    >
      <Box>
        <StyledSettingsIcon color={color} />
      </Box>
    </IconButton>
  )
}

function useColor(props: DeleteIconButtonProps) {
  const theme = useTheme()
  if (props.color) {
    return props.color
  }

  if (props.disabled) {
    return grey[500]
  }

  return theme.colors.error
}

const Box = styled.div`
  background: #ffffff;
  display: inline-flex;
  border-radius: 4px;
`

const StyledSettingsIcon = styled((props: {color: string}) => {
  const {color, ...otherProps} = props

  return <CloseIcon {...otherProps} />
})`
  color: ${(props) => props.color};
`

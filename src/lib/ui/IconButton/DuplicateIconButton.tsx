import React from 'react'
import styled, {useTheme} from 'styled-components'
import IconButton from 'lib/ui/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy'

export default function EditIconButton(props: {
  onClick?: () => void
  className?: string
  color?: string
  showing?: boolean
  ['aria-label']?: string
  type?: 'button' | 'submit'
}) {
  const theme = useTheme()
  const color = props.color || theme.colors.primary
  const type = props.type || 'button'

  if (!props.showing) {
    return null
  }

  return (
    <IconButton
      className={props.className}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      type={type}
    >
      <Box>
        <StyledFileCopyIcon color={color} />
      </Box>
    </IconButton>
  )
}

const Box = styled.div`
  background: #ffffff;
  display: inline-flex;
  border-radius: 4px;
`

const StyledFileCopyIcon = styled((props: {color: string}) => {
  const {color, ...otherProps} = props

  return <FileCopyIcon {...otherProps} />
})`
  color: ${(props) => props.color};
`

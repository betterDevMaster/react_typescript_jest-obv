import React from 'react'
import Button from 'lib/ui/Button'
import styled from 'styled-components'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import {useTheme} from 'styled-components'

export default function BackButton(props: {onClick: () => void}) {
  const theme = useTheme()

  return (
    <StyledButton
      variant="text"
      onClick={props.onClick}
      textColor={theme.colors.primary}
    >
      <BackIcon />
      back
    </StyledButton>
  )
}

const BackIcon = styled(ArrowBackIosIcon)`
  font-size: 12px !important;
  margin-top: 2px;
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`

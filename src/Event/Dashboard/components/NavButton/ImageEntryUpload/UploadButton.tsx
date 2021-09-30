import React from 'react'
import styled from 'styled-components'
import ButtonBase from 'lib/ui/Button'
import NavButton from 'Event/Dashboard/components/NavButton'
import {Icon} from 'lib/fontawesome/Icon'
import {useAttendeeVariables} from 'Event'

export default function UploadButton(
  props: {
    disabled?: boolean
    onClick?: () => void
    isPending?: boolean
  } & NavButton,
) {
  const opacity = props.isPending ? 0.8 : 1
  const v = useAttendeeVariables()

  return (
    <StyledButton
      disabled={props.disabled}
      fullWidth
      textTransform="uppercase"
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
      className={props.className}
      hoverBackgroundColor={props.hoverBackgroundColor}
      disableHover={!props.hoverBackgroundColor}
      borderRadius={props.borderRadius}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
      hoverBorderColor={props.hoverBorderColor}
      minHeight={props.height}
      onClick={props.onClick}
      opacity={opacity}
      padding={props.padding}
      width={props.width}
      fontSize={props.fontSize}
    >
      <>
        <StyledIcon iconClass={props.icon} color={props.textColor} />
        {v(props.text)}
      </>
    </StyledButton>
  )
}

const StyledButton = styled(ButtonBase)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

const StyledIcon = styled(Icon)`
  margin-right: ${(props) => props.theme.spacing[2]};
`

import styled from 'styled-components'
import React from 'react'
import Button from '@material-ui/core/Button'
import {DEFAULT_BUTTON_WIDTH_PERCENT} from 'Event/template/SimpleBlog/SponsorPage/SponsorEditDialog/Form/ButtonConfig'
import {NavButtonProps} from 'Event/Dashboard/components/NavButton'

export default function AddButton(props: {
  className?: string
  onAdd: (button: NavButtonProps) => void
}) {
  const add = () => {
    const button: NavButtonProps = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      isImageUpload: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
      mailchimpTag: null,
      zapierTag: null,
      width: DEFAULT_BUTTON_WIDTH_PERCENT,
      fontSize: 16,
      padding: 8,
    }

    props.onAdd(button)
  }

  return (
    <StyledButton
      color="primary"
      aria-label="add new button"
      onClick={add}
      variant="outlined"
      size="small"
    >
      Add
    </StyledButton>
  )
}

const StyledButton = styled(Button)`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`

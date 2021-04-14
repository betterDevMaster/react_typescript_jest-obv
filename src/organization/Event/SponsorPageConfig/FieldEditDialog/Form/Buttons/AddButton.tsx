import styled from 'styled-components'
import React from 'react'
import Button from '@material-ui/core/Button'
import NavButton from 'Event/Dashboard/components/NavButton'

export default function AddButton(props: {
  className?: string
  onAdd: (button: NavButton) => void
}) {
  const add = () => {
    const button: NavButton = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
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

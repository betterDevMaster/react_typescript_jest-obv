import Button from '@material-ui/core/Button'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React from 'react'

export default function NewMainNavButton(props: {
  onAdd: (button: NavButtonWithSize) => void
}) {
  const addButton = () => {
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
      isAreaButton: false,
      isFormButton: false,
      areaId: null,
      newTab: true,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
    }

    props.onAdd(button)
  }
  return (
    <Button
      variant="outlined"
      color="primary"
      aria-label="add tech check button"
      onClick={addButton}
    >
      New Button
    </Button>
  )
}

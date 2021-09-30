import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React, {useState} from 'react'
import {MainNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

export default function NewMainNavButton(props: {className?: string}) {
  const [button, setButton] = useState<NavButtonWithSize | null>(null)

  const clearButton = () => setButton(null)

  const addButton = () => {
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
      isAreaButton: false,
      isFormButton: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
    }

    setButton(button)
  }
  return (
    <>
      <NewButtonConfig button={button} onClose={clearButton} />
      <Grid item xs={12} className={props.className}>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          color="primary"
          aria-label="add main nav button"
          onClick={addButton}
        >
          New Button
        </Button>
      </Grid>
    </>
  )
}

function NewButtonConfig(props: {
  button: NavButtonWithSize | null
  onClose: () => void
}) {
  if (!props.button) {
    return null
  }

  return (
    <MainNavButtonConfig
      isVisible
      onClose={props.onClose}
      button={props.button}
    />
  )
}

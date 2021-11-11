import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, {useState} from 'react'
import {MainNavButtonConfig} from 'Event/template/Cards/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import {CardsNavButtonProps} from 'Event/template/Cards/Dashboard/CardsNavButton'

export default function NewMainNavButton(props: {className?: string}) {
  const [button, setButton] = useState<CardsNavButtonProps | null>(null)

  const clearButton = () => setButton(null)

  const addButton = () => {
    const button: CardsNavButtonProps = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      isImageUpload: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
      row: 1,
      mailchimpTag: null,
      zapierTag: null,
      fontSize: 18,
      textColor: '#ffffff',
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
  button: CardsNavButtonProps | null
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

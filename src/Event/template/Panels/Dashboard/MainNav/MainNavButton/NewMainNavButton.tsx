import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React, {useState} from 'react'
import {usePanels} from 'Event/template/Panels'
import MainNavButtonConfig from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

export default function NewMainNavButton(props: {className?: string}) {
  const {template} = usePanels()
  const {nav: buttons} = template
  const [button, setButton] = useState<NavButtonWithSize | null>(null)

  if (!buttons) {
    return null
  }

  const addButton = () => {
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
      isAreaButton: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
    }

    setButton(button)
  }
  return (
    <>
      <NewButtonConfig button={button} onClose={() => setButton(null)} />
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
      button={props.button}
      isVisible
      onClose={props.onClose}
    />
  )
}
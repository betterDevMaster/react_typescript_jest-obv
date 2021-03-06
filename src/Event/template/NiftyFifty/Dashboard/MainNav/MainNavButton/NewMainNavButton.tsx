import styled from 'styled-components'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React, {useState} from 'react'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import MainNavButtonConfig from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import Button from 'lib/ui/Button'

export default function NewMainNavButton(props: {className?: string}) {
  const template = useNiftyFiftyTemplate()
  const {nav: buttons} = template
  const [button, setButton] = useState<NavButtonWithSize | null>(null)

  if (!buttons) {
    return null
  }

  const addButton = () => {
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      isImageUpload: false,
      areaId: null,
      size: 12,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
      mailchimpTag: null,
      zapierTag: null,
    }

    setButton(button)
  }

  return (
    <>
      <NewButtonConfig button={button} onClose={() => setButton(null)} />
      <StyledButton
        fullWidth
        variant="outlined"
        color="primary"
        aria-label="add main nav button"
        onClick={addButton}
        className={props.className}
      >
        New Button
      </StyledButton>
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

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  min-height: 40px;
`

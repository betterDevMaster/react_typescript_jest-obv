import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React, {useState} from 'react'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import MainNavButtonConfig from 'Event/template/FiftyBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

export default function NewMainNavButton(props: {className?: string}) {
  const template = useFiftyBlogTemplate()
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
        size="large"
        variant="outlined"
        color="secondary"
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

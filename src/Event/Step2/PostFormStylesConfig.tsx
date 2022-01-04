import TextField from '@material-ui/core/TextField'
import {onUnknownChangeHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import React from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

import {useToggle} from 'lib/toggle'
import {Controller, useForm} from 'react-hook-form'
import {useTemplate} from 'Event/TemplateProvider'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'
import {Template} from 'Event/template'

export default function PostFormStylesConfig() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  const {postFormStyles} = useTemplate()
  const update = useTemplateUpdate()
  const {register, control, handleSubmit} = useForm()

  const submit = (data: Template['postFormStyles']) => {
    update({
      postFormStyles: data,
    })

    toggleConfig()
  }

  return (
    <>
      <StyledEditPostFormStylesButton onClick={toggleConfig} />
      <ComponentConfig
        isVisible={showingConfig}
        onClose={toggleConfig}
        title="Post Form Styles"
      >
        <form onSubmit={handleSubmit(submit)}>
          <Controller
            name="inputStyles.labelColor"
            defaultValue={postFormStyles.inputStyles.labelColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Label Text Color"
                color={value}
                onPick={onChange}
                aria-label="label text color"
              />
            )}
          />
          <Controller
            name="inputStyles.borderColor"
            defaultValue={postFormStyles.inputStyles.borderColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Border Color"
                color={value}
                onPick={onChange}
                aria-label="input box border color"
              />
            )}
          />
          <Controller
            name="inputStyles.backgroundColor"
            defaultValue={postFormStyles.inputStyles.backgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Background Color"
                color={value}
                onPick={onChange}
                aria-label="input box background color"
              />
            )}
          />
          <TextField
            name="inputStyles.backgroundOpacity"
            defaultValue={postFormStyles.inputStyles.backgroundOpacity}
            label="Input Background Color Opacity"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
          <Controller
            name="inputStyles.textColor"
            defaultValue={postFormStyles.inputStyles.textColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Text Color"
                color={value}
                onPick={onChange}
                aria-label="input box text color"
              />
            )}
          />
          <Controller
            name="inputStyles.helperTextColor"
            defaultValue={postFormStyles.inputStyles.helperTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Helper Text Color"
                color={value}
                onPick={onChange}
                aria-label="helper text color"
              />
            )}
          />
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}

function EditPostFormStylesButton(props: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      aria-label="style post form"
      onClick={props.onClick}
    >
      Edit Post Form Styles
    </Button>
  )
}

const StyledEditPostFormStylesButton = styled(EditPostFormStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`

import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Button, TextField} from '@material-ui/core'

import {useTemplate} from 'Event/TemplateProvider'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'

import ColorPicker from 'lib/ui/ColorPicker'
import {useToggle} from 'lib/toggle'

import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

export default function PostFormStylesConfig() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  const {postFormStyles} = useTemplate()
  const update = useTemplateUpdate()
  const {register, control, getValues} = useForm()

  const handlePostFormSubmit = () => {
    const data = getValues()
    update({
      postFormStyles: data,
    })

    toggleConfig()
  }

  return (
    <Box>
      <StyledEditPostFormStylesButton onClick={toggleConfig} />
      <ComponentConfig
        isVisible={showingConfig}
        onClose={toggleConfig}
        title="Post Form Styles"
      >
        <Controller
          name="inputWaiverStyles.labelColor"
          defaultValue={postFormStyles.inputWaiverStyles.labelColor}
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
          name="inputWaiverStyles.borderColor"
          defaultValue={postFormStyles.inputWaiverStyles.borderColor}
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
          name="inputWaiverStyles.backgroundColor"
          defaultValue={postFormStyles.inputWaiverStyles.backgroundColor}
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
          name="inputWaiverStyles.backgroundOpacity"
          defaultValue={postFormStyles.inputWaiverStyles.backgroundOpacity}
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
          name="inputWaiverStyles.textColor"
          defaultValue={postFormStyles.inputWaiverStyles.textColor}
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
          name="inputWaiverStyles.helperTextColor"
          defaultValue={postFormStyles.inputWaiverStyles.helperTextColor}
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
        <Controller
          name="inputWaiverStyles.rdchkSelectedColor"
          defaultValue={postFormStyles.inputWaiverStyles.rdchkSelectedColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Radio/Checkbox Selected Color"
              color={value}
              onPick={onChange}
              aria-label="helper text color"
            />
          )}
        />
        <Controller
          name="inputWaiverStyles.rdchkUnSelectedColor"
          defaultValue={postFormStyles.inputWaiverStyles.rdchkUnSelectedColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Radio/Checkbox Un-Selected Color"
              color={value}
              onPick={onChange}
              aria-label="helper text color"
            />
          )}
        />
        <StyledSaveButton
          onClick={handlePostFormSubmit}
          variant="contained"
          color="primary"
          fullWidth
          aria-label="save"
        >
          Save
        </StyledSaveButton>
      </ComponentConfig>
    </Box>
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

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`
const StyledEditPostFormStylesButton = styled(EditPostFormStylesButton)``
const StyledSaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`

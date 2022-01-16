import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Button, TextField} from '@material-ui/core'

import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

import ColorPicker from 'lib/ui/ColorPicker'
import {useToggle} from 'lib/toggle'

import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

export default function FormStylesConfig() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  const {
    waiver: {formStyles},
  } = useNiftyFiftyTemplate()
  const {register, control, getValues} = useForm()
  const update = useNiftyFiftyUpdate()

  const submit = () => {
    update({
      waiver: getValues(),
    })

    toggleConfig()
  }

  return (
    <Box>
      <StyledEditFormStyleButton onClick={toggleConfig} />
      <ComponentConfig
        isVisible={showingConfig}
        onClose={toggleConfig}
        title="Post Form Styles"
      >
        <Controller
          name="formStyles.labelColor"
          defaultValue={formStyles.labelColor}
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
          name="formStyles.borderColor"
          defaultValue={formStyles.borderColor}
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
          name="formStyles.backgroundColor"
          defaultValue={formStyles.backgroundColor}
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
          name="formStyles.backgroundOpacity"
          defaultValue={formStyles.backgroundOpacity}
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
          name="formStyles.textColor"
          defaultValue={formStyles.textColor}
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
          name="formStyles.helperTextColor"
          defaultValue={formStyles.helperTextColor}
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
          name="formStyles.rdchkSelectedColor"
          defaultValue={formStyles.rdchkSelectedColor}
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
          name="formStyles.rdchkUnSelectedColor"
          defaultValue={formStyles.rdchkUnSelectedColor}
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
          variant="contained"
          color="primary"
          fullWidth
          aria-label="save"
          onClick={submit}
        >
          Save
        </StyledSaveButton>
      </ComponentConfig>
    </Box>
  )
}

function EditFormStyleButton(props: {onClick: () => void; className?: string}) {
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
const StyledEditFormStyleButton = styled(EditFormStyleButton)``
const StyledSaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`

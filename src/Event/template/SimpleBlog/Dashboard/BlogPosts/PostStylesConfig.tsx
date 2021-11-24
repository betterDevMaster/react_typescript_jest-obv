import TextField from '@material-ui/core/TextField'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {Controller, useForm} from 'react-hook-form'

const MAX_SPACING = 250
const MIN_SPACING = 1

export default function PostStylesConfig() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()
  const {register, control, handleSubmit} = useForm()
  const update = useSimpleBlogUpdate()
  const {postStyles} = useSimpleBlogTemplate()

  const save = (data: SimpleBlog['postStyles']) => {
    update({
      postStyles: data,
    })

    toggleConfig()
  }

  return (
    <>
      <StyledEditPostStylesButton onClick={toggleConfig} />
      <ComponentConfig
        isVisible={showingConfig}
        onClose={toggleConfig}
        title="Post Styles"
      >
        <form onSubmit={handleSubmit(save)}>
          <Controller
            name="titleTextColor"
            defaultValue={postStyles.titleTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Title Text Color"
                color={value}
                onPick={onChange}
                aria-label="title text color"
              />
            )}
          />
          <TextField
            name="titleFontSize"
            defaultValue={postStyles.titleFontSize}
            label="Title Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
          <Controller
            name="titleCapitalize"
            defaultValue={postStyles.titleCapitalize}
            control={control}
            render={({value, onChange}) => (
              <Switch
                label="Capitalize Title"
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                labelPlacement="end"
                color="primary"
                aria-label="capitalize title"
              />
            )}
          />
          <Controller
            name="dateTextColor"
            defaultValue={postStyles.dateTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Date Text Color"
                color={value}
                onPick={onChange}
                aria-label="date text color"
              />
            )}
          />
          <Controller
            name="contentTextColor"
            defaultValue={postStyles.contentTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Content Text Color"
                color={value}
                onPick={onChange}
                aria-label="content text color"
              />
            )}
          />
          <TextField
            name="contentFontSize"
            defaultValue={postStyles.contentFontSize}
            label="Content Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
          <InputLabel>Space Between Posts</InputLabel>

          <Controller
            name="spacing"
            defaultValue={postStyles.spacing}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={MIN_SPACING}
                max={MAX_SPACING}
                step={1}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}

function EditPostStylesButton(props: {
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
      aria-label="style posts"
      onClick={props.onClick}
    >
      Edit Post Styles
    </Button>
  )
}

const StyledEditPostStylesButton = styled(EditPostStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`

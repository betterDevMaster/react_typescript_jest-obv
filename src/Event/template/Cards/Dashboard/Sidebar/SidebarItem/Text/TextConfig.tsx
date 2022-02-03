import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Box, InputLabel, Slider} from '@material-ui/core'
import {TextProps} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/Text'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import TextEditor from 'lib/ui/form/TextEditor'
import {handleChangeSlider} from 'lib/dom'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

const MAX_PADDING = 16
const MIN_PADDING = 0

export function TextConfig(
  props: ComponentConfigProps & {
    text: TextProps
  },
) {
  const {isVisible, onClose, text} = props
  const {handleSubmit, control} = useForm()
  const {update} = useEditSidebarItem()

  const save = (data: TextProps) => {
    update(data)
    onClose()
  }

  return (
    <ComponentConfig title="Text" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(save)}>
        <Box mb={2}>
          <Box mb={1}>
            <InputLabel>Body</InputLabel>
          </Box>
          <Controller
            name="body"
            control={control}
            defaultValue={text.body}
            render={({value, onChange}) => (
              <TextEditor data={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box mb={1}>
          <Box mb={1}>
            <InputLabel>Padding</InputLabel>
          </Box>
          <Controller
            name="padding"
            defaultValue={text.padding}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={MIN_PADDING}
                max={MAX_PADDING}
                step={1}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
        </Box>
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}

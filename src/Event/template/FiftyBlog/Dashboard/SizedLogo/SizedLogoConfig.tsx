import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Controller, useForm} from 'react-hook-form'

import {
  Box,
  Button,
  Grid,
  InputLabel,
  Slider,
  Switch,
  TextField,
} from '@material-ui/core'

import {useEvent} from 'Event/EventProvider'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'

import {api} from 'lib/url'
import IconButton from 'lib/ui/IconButton'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'

import {useOrganization} from 'organization/OrganizationProvider'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export function SizedLogoConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {sizedLogo} = template
  const {event} = useEvent()

  const {handleSubmit, control, register} = useForm()

  const submit = (data: FiftyBlog) => {
    update(data)
    onClose()
  }

  return (
    <ComponentConfig title="Sized Logo" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(submit)}>
        <EventImageUpload
          label="Logo Background"
          property="sized_logo"
          current={event.sized_logo}
        />
        <Box display="flex" flexDirection="column" flex="1" mb={2}>
          <InputLabel>Hide Logo Background</InputLabel>

          <Controller
            name="sizedLogo.hidden"
            defaultValue={sizedLogo.hidden}
            control={control}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                color="primary"
                inputProps={{
                  'aria-label': 'toggle logo backgournd visible',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" flexDirection="column" flex="1" mb={2}>
          <InputLabel>Logo Size</InputLabel>
          <Controller
            name="sizedLogo.size"
            defaultValue={sizedLogo.size}
            control={control}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="logo weight"
                value={value}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={MIN_LOGO_SIZE_PERCENT}
                max={MAX_LOGO_SIZE_PERCENT}
              />
            )}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          aria-label="save"
          type="submit"
          color="primary"
        >
          Save
        </Button>
      </form>
    </ComponentConfig>
  )
}

const ExistingEmoji = styled.div`
  display: flex;
  align-items: center;
`

const RemoveButton = styled(IconButton)`
  margin-left: ${(props) => props.theme.spacing[2]};
`

function useDeleteFile(event: any) {
  const {client} = useOrganization()

  return (emoji: string) => {
    const url = api(`/events/${event.slug}/emojis/${emoji}`)
    return client.delete(url)
  }
}

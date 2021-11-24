import React from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useTemplate} from 'Event/TemplateProvider'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import {Controller, useForm} from 'react-hook-form'
import {Template} from 'Event/template'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'

export default function EmojiPageSettings() {
  const {event} = useEvent()
  const {emojiPage} = useTemplate()
  const routes = useEventRoutes()
  const {control, handleSubmit} = useForm()
  const update = useTemplateUpdate()

  const submit = (data: Template['emojiPage']) => {
    update({
      emojiPage: data,
    })
  }

  return (
    <Layout>
      <Page>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <RelativeLink
            to={routes.emoji.root}
            aria-label="view emoji page"
            newTab
            disableStyles
          >
            <Button variant="outlined">View Emojis</Button>
          </RelativeLink>
        </Box>
        <EventImageUpload
          label="Background"
          property="emoji_page_background"
          current={event.emoji_page_background}
          width={1920}
          height={1200}
          canResize
        />
        <form onSubmit={handleSubmit(submit)}>
          <Box display="flex" flexDirection="column" flex="1" mb={2}>
            <InputLabel>Hide Background</InputLabel>
            <Controller
              name="backgroundHidden"
              defaultValue={emojiPage.backgroundHidden}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  color="primary"
                  inputProps={{
                    'aria-label': 'toggle background visible',
                  }}
                />
              )}
            />
          </Box>

          <Controller
            name="backgroundColor"
            defaultValue={emojiPage.backgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Background Color"
                color={value}
                onPick={onChange}
                aria-label="emoji page background color"
              />
            )}
          />

          <Box mb={1}>
            <InputLabel>Background Opacity</InputLabel>

            <Controller
              name="backgroundOpacity"
              defaultValue={emojiPage.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  valueLabelDisplay="auto"
                  aria-label="emoji page background opacity"
                  value={value}
                  valueLabelFormat={() => <div>{value * 100}</div>}
                  onChange={handleChangeSlider(onChange)}
                  step={0.01}
                  min={0}
                  max={1}
                />
              )}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            aria-label="save"
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

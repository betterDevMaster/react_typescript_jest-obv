import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useTemplate, useUpdate} from 'Event/TemplateProvider'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'

export default function EmojiPageSettings(props: {onComplete?: () => void}) {
  const {event} = useEvent()
  const template = useTemplate()
  const {emojiPage: current} = template
  const update = useUpdate()
  const updateEmojiPage = update.primitive('emojiPage')
  const routes = useEventRoutes()

  const [backgroundHidden, setBackgroundHidden] = useState<boolean>(
    current.backgroundHidden || false,
  )
  const [backgroundColor, setBackgroundColor] = useState(
    current.backgroundColor,
  )
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    current.backgroundOpacity,
  )

  useEffect(() => {
    const hasChanges =
      current.backgroundHidden !== backgroundHidden ||
      current.backgroundColor !== backgroundColor ||
      current.backgroundOpacity !== backgroundOpacity

    if (!hasChanges) {
      return
    }

    updateEmojiPage({
      backgroundColor,
      backgroundHidden,
      backgroundOpacity,
    })
  }, [
    current,
    backgroundColor,
    backgroundHidden,
    backgroundOpacity,
    updateEmojiPage,
  ])

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
        <Box display="flex" flexDirection="column" flex="1" mb={2}>
          <InputLabel>Hide Background</InputLabel>
          <Switch
            checked={backgroundHidden}
            onChange={onChangeCheckedHandler(setBackgroundHidden)}
            color="primary"
            inputProps={{
              'aria-label': 'toggle background visible',
            }}
          />
        </Box>
        <ColorPicker
          label="Background Color"
          color={current.backgroundColor || '#FFFFFF'}
          onPick={setBackgroundColor}
          aria-label="emoji page background color"
        />
        <Box mb={1}>
          <InputLabel>Background Opacity</InputLabel>
          <Slider
            valueLabelDisplay="auto"
            aria-label="emoji page background opacity"
            value={current.backgroundOpacity || 0}
            valueLabelFormat={() => (
              <div>{(current.backgroundOpacity || 0) * 100}</div>
            )}
            onChange={handleChangeSlider(setBackgroundOpacity)}
            step={0.01}
            min={0}
            max={1}
          />
        </Box>
      </Page>
    </Layout>
  )
}

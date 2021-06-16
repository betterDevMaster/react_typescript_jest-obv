import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {FOOTER} from 'Event/template/SimpleBlog/Dashboard/Footer'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'

const MIN_FOOTER_IMAGE_SIZE = 1
const MAX_FOOTER_IMAGE_SIZE = 550
export const DEFAULT_FOOTER_IMAGE_SIZE = 100

export type FooterConfig = {
  type: typeof FOOTER
}

export function FooterConfig() {
  const {
    template: {footer},
    update,
  } = useSimpleBlog()
  const {event} = useEvent()
  const updateFooter = update.object('footer')

  return (
    <>
      <ColorPicker
        label="Background Color"
        color={footer.background}
        onPick={updateFooter('background')}
      />
      <ColorPicker
        label="Text Color"
        color={footer.textColor}
        onPick={updateFooter('textColor')}
      />
      <EventImageUpload
        label="Image"
        property="footer_image"
        current={event.footer_image}
      />
      <InputLabel>Image Size</InputLabel>
      <Slider
        min={MIN_FOOTER_IMAGE_SIZE}
        max={MAX_FOOTER_IMAGE_SIZE}
        step={1}
        onChange={handleChangeSlider(updateFooter('imageSize'))}
        valueLabelDisplay="auto"
        value={footer.imageSize || DEFAULT_FOOTER_IMAGE_SIZE}
        aria-label="footer image size"
      />
      <TextField
        label="Terms Link"
        value={footer.termsLink || ''}
        inputProps={{
          'aria-label': 'set footer terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateFooter('termsLink'))}
      />
      <TextField
        label="Privacy Link"
        value={footer.privacyLink || ''}
        inputProps={{
          'aria-label': 'set privacy terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateFooter('privacyLink'))}
      />
      <TextField
        label="Copyright Text"
        value={footer.copyrightText || ''}
        inputProps={{
          'aria-label': 'set copyright text',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateFooter('copyrightText'))}
      />
    </>
  )
}

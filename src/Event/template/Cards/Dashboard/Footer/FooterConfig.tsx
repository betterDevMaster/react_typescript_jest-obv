import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import {Cards, useCards} from 'Event/template/Cards'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

const MIN_FOOTER_IMAGE_SIZE = 1
const MAX_FOOTER_IMAGE_SIZE = 550
export const DEFAULT_FOOTER_IMAGE_SIZE = 100

export function FooterConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {
    template: {footer},
    update,
  } = useCards()

  const [background, setBackground] = useState(footer.background)
  const [textColor, setTextColor] = useState(footer.textColor)
  const [imageSize, setImageSize] = useState(footer.imageSize)
  const [termsLink, setTermsLink] = useState(footer.termsLink)
  const [privacyLink, setPrivacyLink] = useState(footer.privacyLink)
  const [copyrightText, setCopyrightText] = useState(footer.copyrightText)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setBackground(footer.background)
    setTextColor(footer.textColor)
    setImageSize(footer.imageSize)
    setTermsLink(footer.termsLink)
    setPrivacyLink(footer.privacyLink)
    setCopyrightText(footer.copyrightText)
  }, [footer, isVisible])

  const {event} = useEvent()

  const save = () => {
    const data: Cards['footer'] = {
      background,
      textColor,
      imageSize,
      termsLink,
      privacyLink,
      copyrightText,
    }

    update.primitive('footer')(data)
    onClose()
  }

  return (
    <ComponentConfig title="Footer" isVisible={isVisible} onClose={onClose}>
      <ColorPicker
        label="Background Color"
        color={background}
        onPick={setBackground}
      />
      <ColorPicker label="Text Color" color={textColor} onPick={setTextColor} />
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
        onChange={handleChangeSlider(setImageSize)}
        valueLabelDisplay="auto"
        value={imageSize || DEFAULT_FOOTER_IMAGE_SIZE}
        aria-label="footer image size"
      />
      <TextField
        label="Terms Link"
        value={termsLink || ''}
        inputProps={{
          'aria-label': 'set footer terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(setTermsLink)}
      />
      <TextField
        label="Privacy Link"
        value={privacyLink || ''}
        inputProps={{
          'aria-label': 'set privacy terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(setPrivacyLink)}
      />
      <TextField
        label="Copyright Text"
        value={copyrightText || ''}
        inputProps={{
          'aria-label': 'set copyright text',
        }}
        fullWidth
        onChange={onChangeStringHandler(setCopyrightText)}
      />
      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}

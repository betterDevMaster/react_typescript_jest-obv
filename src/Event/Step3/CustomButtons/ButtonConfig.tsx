import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider} from 'lib/dom'
import Slider from '@material-ui/core/Slider'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import LinkConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/LinkConfig'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {eventRoutes} from 'Event/Routes'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function ButtonConfig(props: {
  buttons: EntityList<NavButtonWithSize>
  button: NavButtonWithSize
  id: string | null
  onClose: () => void
  onRemove: () => void
  onUpdate: (button: NavButtonWithSize) => void
  isVisible: boolean
}) {
  const {onUpdate, onClose, button, isVisible} = props

  const [text, setText] = useState(button.text)
  const [size, setSize] = useState(button.size)
  const [newLine, setNewLine] = useState(button.newLine)
  const [backgroundColor, setBackgroundColor] = useState(button.backgroundColor)
  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [areaId, setAreaId] = useState(button.areaId)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)
  const [textColor, setTextColor] = useState(button.textColor)
  const [borderColor, setBorderColor] = useState(button.borderColor)
  const [borderRadius, setBorderRadius] = useState(button.borderRadius)
  const [borderWidth, setBorderWidth] = useState(button.borderWidth)
  const [padding, setPadding] = useState(button.padding)
  const [fontSize, setFontSize] = useState(button.fontSize)
  const [infusionsoftTag, setInfusionsoftTag] = useState(button.infusionsoftTag)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setText(button.text)
    setSize(button.size)
    setNewLine(button.newLine)
    setBackgroundColor(button.backgroundColor)
    setIsAreaButton(button.isAreaButton)
    setAreaId(button.areaId)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
    setTextColor(button.textColor)
    setBorderColor(button.borderColor)
    setBorderRadius(button.borderRadius)
    setBorderWidth(button.borderWidth)
    setPadding(button.padding)
    setFontSize(button.fontSize)
    setInfusionsoftTag(button.infusionsoftTag)
  }, [button, isVisible])

  /**
   * Pages the button can navigate to. We only want to allow tech-check
   * buttons to nativate to self check-in page.
   */
  const pages = {
    [eventRoutes.checkIn]: 'Check-In',
  }

  const save = () => {
    const data: NavButtonWithSize = {
      ...button,
      text,
      size,
      newLine,
      backgroundColor,
      isAreaButton,
      areaId,
      link,
      page,
      newTab,
      textColor,
      borderColor,
      borderWidth,
      padding,
      fontSize,
      infusionsoftTag,
    }

    onUpdate(data)
    onClose()
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose} fullWidth>
      <DialogTitle>Edit Button</DialogTitle>
      <DialogContent>
        <TextField
          label="Text"
          value={text}
          onChange={onChangeStringHandler(setText)}
          inputProps={{
            'aria-label': 'button name input',
          }}
          fullWidth
        />
        <LinkConfig
          isAreaButton={isAreaButton}
          isImageUpload={false}
          page={page}
          setPage={setPage}
          link={link}
          setLink={setLink}
          newTab={newTab}
          setNewTab={setNewTab}
          pages={pages}
        />
        <Typography gutterBottom>Size</Typography>
        <Slider
          min={1}
          max={12}
          value={size || 0}
          onChange={handleChangeSlider(setSize)}
          valueLabelDisplay="auto"
        />
        <FormControlLabel
          label="New Line"
          control={
            <Checkbox
              checked={newLine || false}
              onChange={onChangeCheckedHandler(setNewLine)}
            />
          }
        />
        <BackgroundPicker
          label="Background"
          background={backgroundColor}
          onChange={setBackgroundColor}
        />
        <ColorPicker
          label="Text Color"
          color={textColor}
          onPick={setTextColor}
          aria-label="text color color"
        />
        <ColorPicker
          label="Border Color"
          color={borderColor}
          onPick={setBorderColor}
        />
        <TextField
          value={borderRadius || 0}
          label="Border Radius"
          onChange={onChangeNumberHandler(setBorderRadius)}
          type="number"
          fullWidth
          inputProps={{
            min: MIN_BORDER_RADIUS,
            max: MAX_BORDER_RADIUS,
          }}
        />
        <TextField
          name="borderWidth"
          value={borderWidth || 0}
          onChange={onChangeNumberHandler(setBorderWidth)}
          label="Border Width"
          type="number"
          fullWidth
          inputProps={{
            min: MIN_BORDER_WIDTH,
            max: MAX_BORDER_WIDTH,
          }}
        />
        <TextField
          value={padding || 0}
          onChange={onChangeNumberHandler(setPadding)}
          label="Padding"
          type="number"
          fullWidth
        />
        <TextField
          value={fontSize || ''}
          onChange={onChangeNumberHandler(setFontSize)}
          label="Font Size"
          type="number"
          fullWidth
        />
        <InfusionsoftTagInput
          value={infusionsoftTag}
          onChange={setInfusionsoftTag}
        />

        <SaveButton onClick={save} />
        <Box mt={2} mb={3}>
          <DangerButton
            fullWidth
            variant="outlined"
            aria-label="remove button"
            onClick={props.onRemove}
          >
            REMOVE BUTTON
          </DangerButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

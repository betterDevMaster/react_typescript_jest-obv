import React from 'react'
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
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {TemplateFieldProps} from 'Event/template/SimpleBlog/Step3/TechCheckConfig/TemplateFields'
import {EntityList} from 'lib/list'
import LinkConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/LinkConfig'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {eventRoutes} from 'Event/Routes'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function ButtonConfig(
  props: TemplateFieldProps & {
    buttons: EntityList<NavButtonWithSize>
    id: string | null
    onClose: () => void
    onRemove: () => void
  },
) {
  const {id, set, buttons} = props

  /**
   * Pages the button can navigate to. We only want to allow tech-check
   * buttons to nativate to self check-in page.
   */
  const pages = {
    [eventRoutes.checkIn]: 'Check-In',
  }

  if (!id) {
    return null
  }

  const button = buttons.entities[id]

  const updateButton =
    <T extends keyof NavButtonWithSize>(key: T) =>
    (value: NavButtonWithSize[T]) => {
      const updated = {
        ids: [...buttons.ids],
        entities: {
          ...buttons.entities,
          [id]: {
            ...button,
            [key]: value,
          },
        },
      }

      set('buttons')(updated)
    }

  return (
    <Dialog open={true} onClose={props.onClose} fullWidth>
      <DialogTitle>Edit Button</DialogTitle>
      <DialogContent>
        <TextField
          label="Text"
          value={button.text}
          inputProps={{
            'aria-label': 'button name input',
          }}
          fullWidth
          onChange={onChangeStringHandler(updateButton('text'))}
        />
        <LinkConfig button={button} update={updateButton} pages={pages} />
        <Typography gutterBottom>Size</Typography>
        <Slider
          min={1}
          max={12}
          onChange={handleChangeSlider(updateButton('size'))}
          valueLabelDisplay="auto"
          value={button.size || 0}
        />
        <FormControlLabel
          label="New Line"
          control={
            <Checkbox
              checked={button.newLine || false}
              onChange={onChangeCheckedHandler(updateButton('newLine'))}
            />
          }
        />
        <ColorPicker
          label="Background Color"
          color={button.backgroundColor}
          onPick={updateButton('backgroundColor')}
          aria-label="background color"
        />
        <ColorPicker
          label="Text Color"
          color={button.textColor}
          onPick={updateButton('textColor')}
          aria-label="text color color"
        />
        <ColorPicker
          label="Border  Color"
          color={button.borderColor}
          onPick={updateButton('borderColor')}
          aria-label="border color"
        />
        <TextField
          value={button.borderRadius || ''}
          label="Border Radius"
          type="number"
          fullWidth
          inputProps={{
            min: MIN_BORDER_RADIUS,
            max: MAX_BORDER_RADIUS,
          }}
          onChange={onChangeNumberHandler(updateButton('borderRadius'))}
        />
        <InputLabel>Border Thickness</InputLabel>
        <Slider
          min={MIN_BORDER_WIDTH}
          max={MAX_BORDER_WIDTH}
          step={1}
          onChange={handleChangeSlider(updateButton('borderWidth'))}
          valueLabelDisplay="auto"
          value={button.borderWidth ? button.borderWidth : 0}
          aria-label="border thickness"
        />
        <TextField
          value={button.padding || ''}
          label="Padding"
          type="number"
          fullWidth
          onChange={onChangeNumberHandler(updateButton('padding'))}
        />
        <TextField
          value={button.fontSize || ''}
          label="Font Size"
          type="number"
          fullWidth
          onChange={onChangeNumberHandler(updateButton('fontSize'))}
        />
        <InfusionsoftTagInput
          value={button.infusionsoftTag}
          onChange={updateButton('infusionsoftTag')}
        />
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

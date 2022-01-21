import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider} from 'lib/dom'
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
import {Controller, useForm} from 'react-hook-form'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function ButtonConfig(
  props: TemplateFieldProps & {
    isVisible: boolean
    buttons: EntityList<NavButtonWithSize>
    id: string | null
    onClose: () => void
    onRemove: () => void
    button: NavButtonWithSize
  },
) {
  const {button, onClose, isVisible} = props

  const {register, control} = useForm()

  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [isImageUpload, setisImageUpload] = useState(button.isImageUpload)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setIsAreaButton(button.isAreaButton)
    setisImageUpload(button.isImageUpload)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
  }, [button, isVisible])

  /**
   * Pages the button can navigate to. We only want to allow tech-check
   * buttons to nativate to self check-in page.
   */
  const pages = {
    [eventRoutes.techCheck]: 'Check-In',
  }

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <DialogTitle>Edit Button</DialogTitle>
      <DialogContent>
        <TextField
          label="Text"
          name="text"
          defaultValue={button.text}
          inputProps={{
            'aria-label': 'button name input',
            ref: register,
          }}
          fullWidth
        />

        <LinkConfig
          isAreaButton={isAreaButton}
          isImageUpload={isImageUpload}
          page={page}
          setPage={setPage}
          link={link}
          setLink={setLink}
          newTab={newTab}
          setNewTab={setNewTab}
          pages={pages}
        />

        <Typography gutterBottom>Size</Typography>
        <Controller
          name="size"
          defaultValue={button.size || 0}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={1}
              max={12}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
            />
          )}
        />
        <FormControlLabel
          label="New Line"
          control={
            <Controller
              name="newLine"
              defaultValue={button.newLine || false}
              control={control}
              render={({value, onChange}) => (
                <Checkbox checked={value} onChange={onChange} />
              )}
            />
          }
        />
        <Controller
          name="backgroundColor"
          control={control}
          defaultValue={button.backgroundColor}
          render={({value, onChange}) => (
            <ColorPicker
              label="Background Color"
              color={value}
              onPick={onChange}
            />
          )}
        />
        <Controller
          name="textColor"
          control={control}
          defaultValue={button.textColor}
          render={({value, onChange}) => (
            <ColorPicker label="Text Color" color={value} onPick={onChange} />
          )}
        />
        <Controller
          name="borderColor"
          control={control}
          defaultValue={button.borderColor}
          render={({value, onChange}) => (
            <ColorPicker label="Border Color" color={value} onPick={onChange} />
          )}
        />
        <TextField
          name="borderRadius"
          defaultValue={button.borderRadius || ''}
          label="Border Radius"
          type="number"
          fullWidth
          inputProps={{
            min: MIN_BORDER_RADIUS,
            max: MAX_BORDER_RADIUS,
            ref: register,
          }}
        />
        <TextField
          name="borderWidth"
          defaultValue={button.borderWidth || ''}
          label="Border Width"
          type="number"
          fullWidth
          inputProps={{
            min: MIN_BORDER_WIDTH,
            max: MAX_BORDER_WIDTH,
            ref: register,
          }}
        />
        <TextField
          name="padding"
          defaultValue={button.padding || ''}
          inputProps={{
            ref: register,
          }}
          label="Padding"
          type="number"
          fullWidth
        />
        <TextField
          name="fontSize"
          inputProps={{
            ref: register,
          }}
          defaultValue={button.fontSize || ''}
          label="Font Size"
          type="number"
          fullWidth
        />
        <Controller
          name="infusionsoftTag"
          control={control}
          defaultValue={button.infusionsoftTag}
          render={({value, onChange}) => (
            <InfusionsoftTagInput value={value} onChange={onChange} />
          )}
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

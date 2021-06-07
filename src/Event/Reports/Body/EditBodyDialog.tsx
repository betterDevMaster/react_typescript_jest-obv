import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import {
  DEFAULT_BODY_BACKGROUND_COLOR,
  DEFAULT_BODY_BACKGROUND_OPACITY,
} from 'Event/Reports/ReportsConfig'
import ColorPicker from 'lib/ui/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import {useReportsConfig} from 'organization/Event/Reports'
import {Report} from 'organization/Event/ReportsProvider'
import {useFileSelect} from 'lib/ui/form/file'
import {Controller, useForm} from 'react-hook-form'
import ImageUpload from 'lib/ui/form/ImageUpload'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'

const MIN_BACKGROUND_OPACITY = 0
const MAX_BACKGROUND_OPACITY = 1

type BodySettings = NonNullable<NonNullable<Report['settings']>['body']>

export default function EditBodyDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {report, update, processing} = useReportsConfig()
  const body = report.settings?.body
  const bodyBackground = useFileSelect(report.body_background)
  const {control, handleSubmit} = useForm()

  const createData = (body: BodySettings) => {
    const settings = {
      ...(report.settings || {}),
      body,
    }

    if (bodyBackground.selected) {
      const formData = new FormData()
      formData.set('settings', JSON.stringify(settings))
      formData.set('body_background', bodyBackground.selected)
      return formData
    }

    if (bodyBackground.wasRemoved) {
      return {
        settings,
        body_background: null,
      }
    }

    return {
      settings,
    }
  }

  const save = (body: BodySettings) => {
    if (processing) {
      return
    }

    const data = createData(body)
    update(data).then(props.onClose)
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Edit Body</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(save)}>
            <Controller
              name="backgroundColor"
              control={control}
              defaultValue={
                body?.backgroundColor || DEFAULT_BODY_BACKGROUND_COLOR
              }
              render={({onChange, value}) => (
                <ColorPicker
                  label="Background Overlay Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />
            <InputLabel>Background Overlay Color Opacity</InputLabel>
            <Controller
              name="backgroundOpacity"
              control={control}
              defaultValue={
                body?.backgroundOpacity || DEFAULT_BODY_BACKGROUND_OPACITY
              }
              render={({onChange, value}) => (
                <Slider
                  min={MIN_BACKGROUND_OPACITY}
                  max={MAX_BACKGROUND_OPACITY}
                  step={0.1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                  aria-label="background overlay color opacity"
                />
              )}
            />
            <Box mb={2}>
              <ImageUpload file={bodyBackground}>
                <Image alt="body background" width={100} />
                <UploadButton
                  inputProps={{
                    'aria-label': 'upload body background image',
                  }}
                >
                  Upload Body Background
                </UploadButton>
                <RemoveImageButton aria-label="remove body background" />
              </ImageUpload>
            </Box>
            <SaveButton
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              aria-label="save header"
              disabled={processing}
            >
              SAVE
            </SaveButton>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {
  DEFAULT_TITLE,
  DEFAULT_TITLE_COLOR,
} from 'Event/template/SimpleBlog/Reports/ReportsConfig'
import ColorPicker from 'lib/ui/ColorPicker'
import {useReportsConfig} from 'organization/Event/ReportsConfig'
import {Report} from 'organization/Event/ReportsProvider'
import {useFileSelect} from 'lib/ui/form/file'
import {Controller, useForm} from 'react-hook-form'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import ImageUpload from 'lib/ui/form/ImageUpload'
import Image from 'lib/ui/form/ImageUpload/Image'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'

type HeaderSettings = NonNullable<NonNullable<Report['settings']>['header']>

export default function EditHeaderDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {report, update, processing} = useReportsConfig()
  const {control, handleSubmit, register} = useForm()
  const header = report.settings?.header

  const headerBackground = useFileSelect(report.header_background)

  const createData = (values: HeaderSettings) => {
    const settings = {
      ...(report.settings || {}),
      header: values,
    }

    if (headerBackground.selected) {
      const formData = new FormData()
      formData.set('settings', JSON.stringify(settings))
      formData.set('header_background', headerBackground.selected)
      return formData
    }

    if (headerBackground.wasRemoved) {
      return {
        settings,
        header_background: null,
      }
    }

    return {
      settings,
    }
  }

  const save = (values: HeaderSettings) => {
    if (processing) {
      return
    }

    const data = createData(values)
    update(data).then(props.onClose)
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Edit Header</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(save)}>
            <TextField
              fullWidth
              placeholder="Text"
              inputProps={{
                'aria-label': 'attendee pdf export title',
                ref: register,
              }}
              name="title"
              defaultValue={header?.title || DEFAULT_TITLE}
            />
            <Controller
              name="color"
              control={control}
              defaultValue={header?.color || DEFAULT_TITLE_COLOR}
              render={({onChange, value}) => (
                <ColorPicker
                  label="Text Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />
            <Box mb={2}>
              <ImageUpload file={headerBackground}>
                <Image alt="header background" width={100} />
                <UploadButton
                  inputProps={{
                    'aria-label': 'upload header background image',
                  }}
                >
                  Upload Header Background
                </UploadButton>
                <RemoveImageButton aria-label="remove header background" />
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

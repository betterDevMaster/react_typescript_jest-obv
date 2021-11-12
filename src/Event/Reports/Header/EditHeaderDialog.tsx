import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {DEFAULT_TITLE, DEFAULT_TITLE_COLOR} from 'Event/Reports/ReportsConfig'
import ColorPicker from 'lib/ui/ColorPicker'
import {useReportsConfig} from 'organization/Event/Reports'
import {Report} from 'organization/Event/ReportsProvider'
import {Controller, useForm} from 'react-hook-form'
import ImageAssetUploader from 'lib/asset/ImageAssetUploader'

type HeaderSettings = NonNullable<NonNullable<Report['settings']>['header']>

export default function EditHeaderDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {report, update, processing} = useReportsConfig()
  const {control, handleSubmit, register} = useForm()
  const header = report.settings?.header

  const createData = (values: HeaderSettings) => {
    const settings = {
      ...(report.settings || {}),
      header: values,
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
            <Controller
              name="background"
              control={control}
              defaultValue={header?.background}
              render={({onChange, value}) => (
                <ImageAssetUploader
                  label="Header Background"
                  onChange={onChange}
                  value={value}
                  canResize
                  width={1148}
                  height={200}
                />
              )}
            />
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

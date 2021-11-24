import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import Typography from '@material-ui/core/Typography'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'

type FAQPageSettings = NonNullable<SimpleBlog['faq']>

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {handleSubmit, register, control} = useForm()
  const template = useSimpleBlogTemplate()

  const update = useSimpleBlogUpdate()

  const {faq: pageSettings} = template

  const submit = (form: FAQPageSettings) => {
    update({
      faq: form,
    })

    props.onClose()
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Faq Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Title"
              name="title"
              defaultValue={pageSettings?.title}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'faq page title', ref: register}}
            />
            <Controller
              name="description"
              defaultValue={pageSettings?.description}
              control={control}
              render={({onChange, value}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />
            <TextField
              defaultValue={pageSettings?.backToDashboardText}
              name="backToDashboardText"
              label="Back to Dashboard Text"
              fullWidth
              inputProps={{
                ref: register,
                'aria-label': 'back to dashboard text',
              }}
            />
            <Grid item xs={12}>
              <Controller
                name="backToDashboardTextColor"
                defaultValue={pageSettings?.backToDashboardTextColor}
                control={control}
                render={({onChange, value}) => (
                  <ColorPicker
                    label="Back to Dashboard Text Color"
                    color={value}
                    onPick={onChange}
                    aria-label="text color"
                  />
                )}
              />
            </Grid>
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
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}

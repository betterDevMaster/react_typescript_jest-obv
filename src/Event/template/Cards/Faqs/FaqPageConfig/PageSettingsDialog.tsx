import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import Typography from '@material-ui/core/Typography'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import Switch from 'lib/ui/form/Switch'
import FormControl from '@material-ui/core/FormControl'
import {onChangeCheckedHandler} from 'lib/dom'

type FAQPageSettings = NonNullable<Cards['faq']>

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {handleSubmit, register, control} = useForm()
  const template = useCardsTemplate()
  const updateCards = useCardsUpdate()
  const {faq: pageSettings} = template

  const submit = (data: FAQPageSettings) => {
    updateCards({
      faq: data,
    })
    props.onClose()
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Faq Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <FormControl>
              <Controller
                name="isVisible"
                control={control}
                defaultValue={pageSettings.isVisible}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="toggle faqs"
                    labelPlacement="end"
                    color="primary"
                    label="Enabled"
                  />
                )}
              />
            </FormControl>
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
              name="menuTitle"
              label="Faq Page Menu Title"
              defaultValue={pageSettings.menuTitle}
              required
              fullWidth
              inputProps={{
                ref: register({required: 'Faq Page Menu Title is required.'}),
                'aria-label': 'edit faq page menu title',
              }}
            />
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

import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Dialog from 'lib/ui/Dialog'
import {Controller, useForm} from 'react-hook-form'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqList/Card'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import Switch from 'lib/ui/form/Switch'
import {onChangeCheckedHandler} from 'lib/dom'

type FAQPageSettings = NonNullable<FiftyBlog['faq']>

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {handleSubmit, register, control} = useForm()
  const template = useFiftyBlogTemplate()
  const updateTemplate = useFiftyBlogUpdate()

  const {faq: pageSettings} = template

  const data = ({
    title,
    description,
    menuTitle,
    isVisible,
  }: FAQPageSettings) => {
    const required = {
      faq: {
        title,
        description,
        menuTitle,
        isVisible,
      },
    }
    return required
  }

  const submit = (form: FAQPageSettings) => {
    updateTemplate(data(form))
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
                    arial-label="toggle faq"
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
              defaultValue={pageSettings?.title || DEFAULT_TITLE}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'faq page title', ref: register}}
            />
            <TextField
              name="menuTitle"
              label="Faq Page Menu Title"
              defaultValue={pageSettings.menuTitle || DEFAULT_TITLE}
              required
              fullWidth
              inputProps={{
                ref: register({
                  required: 'Faq Page Menu Title is required.',
                }),
                'aria-label': 'edit faq page menu title',
              }}
            />
            <Controller
              name="description"
              defaultValue={pageSettings?.description || DEFAULT_DESCRIPTION}
              control={control}
              render={({onChange, value}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
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

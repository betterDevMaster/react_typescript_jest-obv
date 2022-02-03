import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Button from '@material-ui/core/Button'
import {onChangeStringHandler} from 'lib/dom'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {
  createLanguage,
  ENGLISH,
  Language,
} from 'Event/LanguageProvider/language'
import {useForm} from 'react-hook-form'
import {useLanguage} from 'Event/LanguageProvider'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'

export default function AddLanguageButton(props: {
  onAdd: (language: Language['name']) => void
}) {
  const {onAdd} = props
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  return (
    <>
      <AddLanguageDialog
        open={dialogVisible}
        onClose={toggleDialog}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onAdd={onAdd}
      />
      <Button
        onClick={toggleDialog}
        variant="outlined"
        disabled={isProcessing}
        color="primary"
        aria-label="add language"
      >
        Add Language
      </Button>
    </>
  )
}

function AddLanguageDialog(props: {
  open: boolean
  onClose: () => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  onAdd: (language: Language['name']) => void
}) {
  const {isProcessing, setIsProcessing, open, onClose, onAdd} = props
  const [language, setLanguage] = useState('')
  const {event} = useEvent()
  const updateEvent = useUpdate()
  const {handleSubmit} = useForm()
  const {languages} = useLanguage()
  const [error, setError] = useState<string | null>(null)

  const current = useMemo(
    () => event.localization?.languages || [createLanguage(ENGLISH)],
    [event],
  )

  useEffect(() => {
    setLanguage('')
  }, [open])

  const add = useCallback(() => {
    if (isProcessing || !language) {
      return
    }

    setError(null)

    const alreadyExists = languages.map((l) => l.name).includes(language)
    if (alreadyExists) {
      setError('Language already exists')
      return
    }

    setIsProcessing(true)

    const updates = {
      localization: {
        ...(event.localization || {}),
        languages: [...current, createLanguage(language)],
      },
    }

    updateEvent(updates).finally(() => {
      setIsProcessing(false)
      onAdd(language)
      onClose()
    })
  }, [
    current,
    event,
    isProcessing,
    language,
    languages,
    setIsProcessing,
    updateEvent,
    onClose,
    onAdd,
  ])

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Add Language</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(add)}>
          <Box mb={1}>
            <TextField
              label="Language"
              value={language}
              fullWidth
              variant="outlined"
              onChange={onChangeStringHandler(setLanguage)}
              inputProps={{
                'aria-label': 'new language',
              }}
              error={!!error}
              helperText={error}
              disabled={isProcessing}
            />
          </Box>
          <Box mb={2}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              aria-label="save language"
              disabled={isProcessing}
            >
              Add
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

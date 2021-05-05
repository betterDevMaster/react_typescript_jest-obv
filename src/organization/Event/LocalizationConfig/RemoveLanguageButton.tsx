import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import {Language} from 'Event/LanguageProvider/language'
import DangerButton from 'lib/ui/Button/DangerButton'
import React, {useState} from 'react'

export default function RemoveLanguageButton(props: {
  onRemove: () => void
  canRemove: boolean
  language: Language
}) {
  const {language, canRemove, onRemove} = props
  const [dialogVisible, setDialogVisible] = useState(false)
  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const remove = () => {
    toggleDialog()
    onRemove()
  }

  return (
    <>
      <Dialog open={dialogVisible} onClose={toggleDialog}>
        <DialogContent>
          <Typography color="error">Warning: </Typography> You're about to
          remove the {language} Language, and all its corresponding entries. Are
          you sure you want to remove {language}?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggleDialog} color="primary">
            Cancel
          </Button>
          <DangerButton onClick={remove} aria-label="confirm remove">
            Remove
          </DangerButton>
        </DialogActions>
      </Dialog>
      <DangerButton
        onClick={toggleDialog}
        aria-label="remove language"
        variant="outlined"
        disabled={!canRemove}
      >
        Remove Language
      </DangerButton>
    </>
  )
}

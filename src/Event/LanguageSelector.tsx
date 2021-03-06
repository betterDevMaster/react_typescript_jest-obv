import React, {useState} from 'react'
import {useLanguage} from 'Event/LanguageProvider'
import LanguageIcon from '@material-ui/icons/Language'
import styled from 'styled-components'
import {Language} from 'Event/LanguageProvider/language'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

export default function LanguageSelector() {
  const {current, set} = useLanguage()
  const isEditMode = useEditMode()
  const {languages, translationsEnabled} = useLanguage()
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const isSelected = (language: Language) => language.name === current

  const handleSelect = (language: Language) => {
    set(language)
    toggleDialog()
  }

  if (!translationsEnabled || isEditMode) {
    return null
  }

  return (
    <BottomLeft>
      <StyledButton
        variant="contained"
        color="primary"
        aria-label="change language"
        onClick={toggleDialog}
        startIcon={<LanguageIcon />}
        disableRipple
      >
        Change Language
      </StyledButton>
      <Dialog
        open={dialogVisible}
        onClose={toggleDialog}
        fullWidth
        maxWidth="xs"
      >
        <List disablePadding>
          {languages.map((language) => (
            <ListItem
              key={language.name}
              button
              selected={isSelected(language)}
              onClick={() => handleSelect(language)}
            >
              {language.name}
            </ListItem>
          ))}
        </List>
      </Dialog>
    </BottomLeft>
  )
}

const BottomLeft = styled.div`
  position: fixed;
  left: ${(props) => props.theme.spacing[4]};
  bottom: ${(props) => props.theme.spacing[4]};
  z-index: 10;
  width: 50px;
`

const StyledButton = styled(Button)`
  padding-top: ${(props) => props.theme.spacing[2]} !important;
  white-space: nowrap;
  svg {
    font-size: 24px !important;
    margin-bottom: 2px;
  }
`

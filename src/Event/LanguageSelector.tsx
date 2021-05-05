import React, {useState} from 'react'
import {useLanguage} from 'Event/LanguageProvider'
import LanguageIcon from '@material-ui/icons/Language'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import {Language} from 'Event/LanguageProvider/language'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Dialog from '@material-ui/core/Dialog'

export default function LanguageSelector() {
  const {current, set} = useLanguage()
  const isEditMode = useEditMode()
  const {languages, translationsEnabled} = useLanguage()
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const isSelected = (language: Language) => language === current

  const handleSelect = (language: Language) => {
    set(language)
    toggleDialog()
  }

  if (!translationsEnabled || isEditMode) {
    return null
  }

  return (
    <BottomLeft>
      <IconButton
        aria-haspopup="true"
        color="primary"
        onClick={toggleDialog}
        aria-label="change language"
      >
        <LanguageIcon />
      </IconButton>
      <Dialog
        open={dialogVisible}
        onClose={toggleDialog}
        fullWidth
        maxWidth="xs"
      >
        <List disablePadding>
          {languages.map((language) => (
            <ListItem
              key={language}
              button
              selected={isSelected(language)}
              onClick={() => handleSelect(language)}
            >
              {language}
            </ListItem>
          ))}
        </List>
      </Dialog>
    </BottomLeft>
  )
}

const BottomLeft = styled.div`
  position: fixed;
  left: ${(props) => props.theme.spacing[10]};
  bottom: ${(props) => props.theme.spacing[8]};
  z-index: 10;
  width: 50px;
`

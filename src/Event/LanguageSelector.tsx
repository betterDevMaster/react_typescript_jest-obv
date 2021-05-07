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
import {useTemplate} from 'Event/TemplateProvider'

export default function LanguageSelector() {
  const {current, set} = useLanguage()
  const isEditMode = useEditMode()
  const {languages, translationsEnabled} = useLanguage()
  const [dialogVisible, setDialogVisible] = useState(false)
  const {isDarkMode} = useTemplate()

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
      <StyledButton
        variant="contained"
        color="primary"
        aria-label="change language"
        onClick={toggleDialog}
        startIcon={<LanguageIcon />}
        disableRipple
        isDarkMode={isDarkMode}
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

const StyledButton = styled((props) => {
  const {isDarkMode, ...otherProps} = props
  return <Button {...otherProps} />
})<{
  isDarkMode?: boolean
}>`
  padding-top: ${(props) => props.theme.spacing[2]} !important;
  white-space: nowrap;
  ${(props) =>
    props.isDarkMode ? 'background-color: rgba(0, 0, 0, 0.6) !important;' : ''}
  ${(props) => (props.isDarkMode ? 'color: #ffffff !important;' : '')}


  &:hover {
    ${(props) =>
      props.isDarkMode
        ? 'background-color: rgba(0, 0, 0, 0.75) !important;'
        : ''}
  }
  svg {
    font-size: 24px !important;
    margin-bottom: 2px;
  }
`

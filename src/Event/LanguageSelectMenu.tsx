import React, {useState} from 'react'
import {useDefaultLanguage, useLanguage} from 'Event/LanguageProvider'
import LanguageIcon from '@material-ui/icons/Language'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {Language, ALL_LANGUAGES} from 'Event/LanguageProvider/language'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {withStyles} from '@material-ui/core'

type LanguageLabel = {
  label: string
  code: Language
}

export default function CustomizedPopoverMenu() {
  const {language, set} = useLanguage()
  const defaultLanguage = useDefaultLanguage()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const isEditMode = useEditMode()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const onSelectLanguage = (
    _: React.ChangeEvent<{}>,
    language: Language | null,
  ) => {
    set(language || defaultLanguage)
  }

  if (isEditMode) {
    return null
  }
  return (
    <StickyDiv>
      <IconButton aria-haspopup="true" color="primary" onClick={handleClick}>
        <LanguageIcon />
      </IconButton>
      <Popover
        id="select-language-popup"
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <LanguageBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <LanguageIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Choose Your Language
            </Typography>
          </Toolbar>
        </LanguageBar>
        <Content>
          <Autocomplete
            id="select-language-autocomplete"
            options={(ALL_LANGUAGES as unknown) as Language[]}
            autoHighlight
            value={language}
            onChange={onSelectLanguage}
            ListboxProps={{style: {height: 200}}}
            renderInput={(params) => (
              <StyledTextField
                variant="outlined"
                {...params}
                fullWidth
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
        </Content>
      </Popover>
    </StickyDiv>
  )
}

const StickyDiv = styled.div`
  position: fixed;
  left: ${(props) => props.theme.spacing[15]};
  bottom: ${(props) => props.theme.spacing[15]};
  z-index: 10;
  width: 50px;
`

const LanguageBar = styled(AppBar)`
  background-color: #131d34 !important;
`

const Content = styled.div`
  padding: ${(props) => props.theme.spacing[4]};
`

const StyledTextField = withStyles({
  root: {
    marginBottom: 0,
  },
})(TextField)

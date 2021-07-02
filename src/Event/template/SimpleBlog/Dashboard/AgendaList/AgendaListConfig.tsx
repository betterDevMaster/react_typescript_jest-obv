import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import {onChangeStringHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'
import FontStyleInput from 'lib/ui/typography/FontStyleInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import Button from '@material-ui/core/Button'
import {ComponentConfigProps} from 'organization/Event/DashboardConfig/ComponentConfig'

export function AgendaListConfig(props: ComponentConfigProps) {
  const {template, update} = useSimpleBlog()
  const {agenda: settings} = template
  const {isVisible: visible, onClose} = props
  const [title, setTitle] = useState(settings.title)
  const [description, setDescription] = useState(settings.description)
  const [descriptionFontStyles, setDescriptionFontStyles] = useState(
    settings.descriptionFontStyles,
  )
  const [footer, setFooter] = useState(settings.footer)
  const [footerFontStyles, setFooterFontStyle] = useState(
    settings.footerFontStyles,
  )

  const save = () => {
    const updated: SimpleBlog['agenda'] = {
      ...settings,
      title,
      description,
      descriptionFontStyles,
      footer,
      footerFontStyles,
    }

    update.primitive('agenda')(updated)
    onClose()
  }

  useEffect(() => {
    if (visible) {
      // Prevent losing current changes
      return
    }

    setTitle(settings.title)
    setDescription(settings.description)
    setDescriptionFontStyles(settings.descriptionFontStyles)
    setFooter(settings.footer)
    setFooterFontStyle(settings.footerFontStyles)
  }, [settings, visible])

  return (
    <Dialog open={visible} onClose={onClose} fullWidth>
      <DialogTitle>Agendas</DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          inputProps={{
            'aria-label': 'update agendas title',
          }}
          label="Title"
          fullWidth
          onChange={onChangeStringHandler(setTitle)}
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="agenda-adornment-description">
            Description
          </InputLabel>
          <Input
            id="agenda-adornment-description"
            type="text"
            value={description || ''}
            onChange={onChangeStringHandler(setDescription)}
            aria-label="update agendas description"
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <FontStyleInput
                  onChange={setDescriptionFontStyles}
                  value={descriptionFontStyles || []}
                />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="agenda-adornment-footer">Footer</InputLabel>
          <Input
            id="agenda-adornment-footer"
            type="text"
            value={footer || ''}
            onChange={onChangeStringHandler(setFooter)}
            aria-label="update agendas footer"
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <FontStyleInput
                  onChange={setFooterFontStyle}
                  value={footerFontStyles || []}
                />
              </InputAdornment>
            }
          />
        </FormControl>
        <SaveButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          aria-label="save"
          onClick={save}
        >
          SAVE
        </SaveButton>
      </DialogContent>
    </Dialog>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

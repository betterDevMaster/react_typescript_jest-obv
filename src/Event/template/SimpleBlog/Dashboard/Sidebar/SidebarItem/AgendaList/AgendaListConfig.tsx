import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'
import FontStyleInput from 'lib/ui/typography/FontStyleInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {AgendaListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function AgendaListConfig(
  props: ComponentConfigProps & {
    list: AgendaListProps
  },
) {
  const {list} = props
  const {isVisible: visible, onClose} = props
  const [title, setTitle] = useState(list.title)
  const [description, setDescription] = useState(list.description)
  const [descriptionFontStyles, setDescriptionFontStyles] = useState(
    list.descriptionFontStyles,
  )
  const [footer, setFooter] = useState(list.footer)
  const [footerFontStyles, setFooterFontStyle] = useState(list.footerFontStyles)
  const {update: updateItem} = useEditSidebarItem()

  const save = () => {
    const updated: AgendaListProps = {
      ...list,
      title,
      description,
      descriptionFontStyles,
      footer,
      footerFontStyles,
    }

    updateItem(updated)
    onClose()
  }

  useEffect(() => {
    if (visible) {
      // Prevent losing current changes
      return
    }

    setTitle(list.title)
    setDescription(list.description)
    setDescriptionFontStyles(list.descriptionFontStyles)
    setFooter(list.footer)
    setFooterFontStyle(list.footerFontStyles)
  }, [list, visible])

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
        <SaveButton onClick={save} />
      </DialogContent>
    </Dialog>
  )
}

import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import {
  onChangeCheckedHandler,
  onChangeStringHandler,
  onUnknownChangeHandler,
} from 'lib/dom'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import {ButtonConfigProps} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'
import {EVENT_PAGES} from 'Event/Routes'

export default function LinkConfig<T extends NavButton>(
  props: ButtonConfigProps<T>,
) {
  if (props.button.isAreaButton) {
    return null
  }

  return (
    <>
      <PageSelect {...props} />
      <LinkInput {...props} />
    </>
  )
}

function PageSelect<T extends NavButton>(props: ButtonConfigProps<T>) {
  const {update, button} = props

  const value = button.page ? button.page : 0

  const setLink = (link: string | number) => {
    if (typeof link === 'number') {
      update('page')(null)
      return
    }

    update('page')(link)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Page</InputLabel>
      <Select
        value={value}
        fullWidth
        onChange={onUnknownChangeHandler(setLink)}
        label="Link"
        inputProps={{
          'aria-label': 'pick page',
        }}
      >
        {Object.entries(EVENT_PAGES).map(([link, label]) => (
          <MenuItem value={link} aria-label={`${label} page`} key={link}>
            {label}
          </MenuItem>
        ))}
        <MenuItem value={0} aria-label="set other link">
          Other
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function LinkInput<T extends NavButton>(props: ButtonConfigProps<T>) {
  if (props.button.page) {
    return null
  }

  return (
    <>
      <TextField
        label="URL"
        value={props.button.link || ''}
        inputProps={{
          'aria-label': 'button link input',
        }}
        fullWidth
        onChange={onChangeStringHandler(props.update('link'))}
        helperText="Starting with https:// or http://"
      />
      <FormControl>
        <FormControlLabel
          label="New Tab"
          control={
            <Checkbox
              checked={props.button.newTab || false}
              onChange={onChangeCheckedHandler(props.update('newTab'))}
            />
          }
        />
      </FormControl>
    </>
  )
}
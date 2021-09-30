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
import NavButton from 'Event/Dashboard/components/NavButton'
import {EventPages, EVENT_PAGES} from 'Event/Routes'
import {TargetConfigProps} from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'

type LinkConfigProps = Pick<
  TargetConfigProps,
  | 'isAreaButton'
  | 'isImageUpload'
  | 'page'
  | 'setPage'
  | 'disablePageSelect'
  | 'link'
  | 'setLink'
  | 'newTab'
  | 'setNewTab'
> & {
  pages?: EventPages
}

export default function LinkConfig(props: LinkConfigProps) {
  if (props.isAreaButton || props.isImageUpload) {
    return null
  }

  return (
    <>
      <PageSelect {...props} />
      <LinkInput {...props} />
      <FormControl>
        <FormControlLabel
          label="New Tab"
          control={
            <Checkbox
              checked={props.newTab}
              onChange={onChangeCheckedHandler(props.setNewTab)}
            />
          }
        />
      </FormControl>
    </>
  )
}

function PageSelect<T extends NavButton>(props: LinkConfigProps) {
  const pages = props.pages || EVENT_PAGES

  const value = props.page || 0

  const setLink = (link: string | number) => {
    if (typeof link === 'number') {
      props.setPage(null)
      return
    }

    props.setPage(link)
  }

  if (props.disablePageSelect) {
    return null
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
        {Object.entries(pages).map(([link, label]) => (
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

function LinkInput(props: LinkConfigProps) {
  if (props.page) {
    return null
  }

  return (
    <TextField
      label="URL"
      value={props.link || ''}
      inputProps={{
        'aria-label': 'button link input',
      }}
      fullWidth
      onChange={onChangeStringHandler(props.setLink)}
      helperText="Starting with https:// or http://"
    />
  )
}

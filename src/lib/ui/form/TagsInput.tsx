import React, {useEffect, useState} from 'react'
import Downshift from 'downshift'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import {onChangeStringHandler} from 'lib/dom'
import {makeStyles} from '@material-ui/core/styles'

export type Tag = string

export default function TagsInput(props: {
  value?: Tag[]
  'aria-label'?: string
  name: string
  label?: string
  disabled?: boolean
  onChange: (tags: Tag[]) => void
}) {
  const {onChange} = props
  const [input, setInput] = useState('')
  const [tags, setTags] = useState<Tag[]>(props.value || [])

  useEffect(() => {
    onChange(tags)
  }, [tags, onChange])

  const classes = useStyles()

  const addItem = () => {
    if (!input) {
      return
    }

    const existing = tags.find((t) => t === input)
    if (existing) {
      setInput('')
      return
    }

    const isEmpty = input.replace(/\s/g, '').length === 0
    if (isEmpty) {
      return
    }

    const value = input.trim() // Don't want trailing white space

    const added = [...tags, value]
    setTags(added)
    setInput('')
  }

  const deleteTag = (tag: Tag) => {
    const removed = tags.filter((t) => t !== tag)
    setTags(removed)
  }

  const removeLastItem = () => {
    const hasInput = input.length > 0
    if (hasInput) {
      // Prevent edit backspace from deleting tag
      return
    }

    const lastItem = tags[tags.length - 1]
    if (!lastItem) {
      return
    }

    deleteTag(lastItem)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault() // Prevent submitting form
        addItem()
        break
      case 'Backspace':
        removeLastItem()
        break
    }
  }

  return (
    <Downshift inputValue={input}>
      {({getInputProps}) => {
        const {onBlur, onChange, onFocus, ...inputProps} = getInputProps({
          onKeyDown: handleKeyDown,
        })

        return (
          <div>
            <TextField
              onChange={onChangeStringHandler(setInput)}
              label={props.label}
              disabled={props.disabled}
              InputProps={{
                classes: {
                  root: classes.root,
                },
                startAdornment: tags.map((item) => (
                  <span aria-label="tag" key={item}>
                    <Chip
                      tabIndex={-1}
                      color="primary"
                      label={item}
                      onDelete={() => deleteTag(item)}
                      className={classes.chip}
                      disabled={props.disabled}
                    />
                  </span>
                )),
                onBlur,
                onFocus,
              }}
              inputProps={{...inputProps, 'aria-label': props['aria-label']}}
              name={props.name}
              fullWidth
              variant="outlined"
            />
          </div>
        )
      }}
    </Downshift>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}))

import TextField from '@material-ui/core/TextField'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler, onChangeNumberHandler} from 'lib/dom'
import {withDefault} from 'lib/template'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import React, {useEffect, useMemo, useState} from 'react'

export const DEFAULT_TITLE_TEXT_COLOR = '#000000'
export const DEFAULT_TITLE_FONT_SIZE = 30
export const DEFAULT_TITLE_CAPITALIZE = true
export const DEFAULT_DATE_TEXT_COLOR = '#adadad'
export const DEFAULT_CONTENT_TEXT_COLOR = '#000000'
export const DEFAULT_CONTENT_FONT_SIZE = 17

export default function PostStylesConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const {update} = useSimpleBlog()

  const styles = usePostStyles()

  const [titleTextColor, setTitleTextColor] = useState(styles.titleTextColor)
  const [titleFontSize, setTitleFontSize] = useState(styles.titleFontSize)
  const [titleCapitalize, setTitleCapitalize] = useState(styles.titleCapitalize)
  const [dateTextColor, setDateTextColor] = useState(styles.dateTextColor)
  const [contentTextColor, setContentTextColor] = useState(
    styles.contentTextColor,
  )
  const [contentFontSize, setContentFontSize] = useState(styles.contentFontSize)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setTitleTextColor(styles.titleTextColor)
    setTitleFontSize(styles.titleFontSize)
    setTitleCapitalize(styles.titleCapitalize)
    setDateTextColor(styles.dateTextColor)
    setContentTextColor(styles.contentTextColor)
    setContentFontSize(styles.contentFontSize)
  }, [isVisible, styles])

  const save = () => {
    const updated: SimpleBlog['postStyles'] = {
      titleTextColor,
      titleFontSize,
      titleCapitalize,
      dateTextColor,
      contentTextColor,
      contentFontSize,
    }

    update.primitive('postStyles')(updated)
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Post Styles"
    >
      <ColorPicker
        label="Title Text Color"
        color={titleTextColor}
        onPick={setTitleTextColor}
        aria-label="title text color"
      />
      <TextField
        value={titleFontSize}
        label="Title Font Size"
        type="number"
        fullWidth
        inputProps={{
          min: 0,
        }}
        onChange={onChangeNumberHandler(setTitleFontSize)}
      />
      <Switch
        label="Capitalize Title"
        checked={titleCapitalize}
        onChange={onChangeCheckedHandler(setTitleCapitalize)}
        labelPlacement="end"
        color="primary"
        aria-label="capitalize title"
      />
      <ColorPicker
        label="Date Text Color"
        color={dateTextColor}
        onPick={setDateTextColor}
        aria-label="date text color"
      />
      <ColorPicker
        label="Content Text Color"
        color={contentTextColor}
        onPick={setContentTextColor}
        aria-label="content text color"
      />
      <TextField
        value={contentFontSize}
        label="Content Font Size"
        type="number"
        fullWidth
        inputProps={{
          min: 0,
        }}
        onChange={onChangeNumberHandler(setContentFontSize)}
      />
      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}

export function usePostStyles() {
  const {
    template: {postStyles},
  } = useSimpleBlog()

  return useMemo(
    () => ({
      titleTextColor: postStyles?.titleTextColor || DEFAULT_TITLE_TEXT_COLOR,
      titleFontSize: withDefault(
        DEFAULT_TITLE_FONT_SIZE,
        postStyles?.titleFontSize,
      ),
      titleCapitalize: withDefault(
        DEFAULT_TITLE_CAPITALIZE,
        postStyles?.titleCapitalize,
      ),
      dateTextColor: postStyles?.dateTextColor || DEFAULT_DATE_TEXT_COLOR,
      contentTextColor:
        postStyles?.contentTextColor || DEFAULT_CONTENT_TEXT_COLOR,
      contentFontSize: withDefault(
        DEFAULT_CONTENT_FONT_SIZE,
        postStyles?.contentFontSize,
      ),
    }),
    [postStyles],
  )
}

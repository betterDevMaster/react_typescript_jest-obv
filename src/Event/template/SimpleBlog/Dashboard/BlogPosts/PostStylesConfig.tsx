import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler, onChangeNumberHandler} from 'lib/dom'
import {withDefault} from 'lib/template'
import ColorPicker from 'lib/ui/ColorPicker'
import Dialog from 'lib/ui/Dialog'
import Switch from 'lib/ui/form/Switch'
import React from 'react'

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

  const updateStyles = update.object('postStyles')
  const styles = usePostStyles()

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <DialogTitle>Post Styles</DialogTitle>
      <DialogContent>
        <ColorPicker
          label="Title Text Color"
          color={styles.titleTextColor}
          onPick={updateStyles('titleTextColor')}
          aria-label="title text color"
        />
        <TextField
          value={styles.titleFontSize}
          label="Title Font Size"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
          }}
          onChange={onChangeNumberHandler(updateStyles('titleFontSize'))}
        />
        <Switch
          label="Capitalize Title"
          checked={styles.titleCapitalize}
          onChange={onChangeCheckedHandler(updateStyles('titleCapitalize'))}
          labelPlacement="end"
          color="primary"
          aria-label="capitalize title"
        />
        <ColorPicker
          label="Date Text Color"
          color={styles.dateTextColor}
          onPick={updateStyles('dateTextColor')}
          aria-label="date text color"
        />
        <ColorPicker
          label="Content Text Color"
          color={styles.contentTextColor}
          onPick={updateStyles('contentTextColor')}
          aria-label="content text color"
        />
        <TextField
          value={styles.contentFontSize}
          label="Content Font Size"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
          }}
          onChange={onChangeNumberHandler(updateStyles('contentFontSize'))}
        />
      </DialogContent>
    </Dialog>
  )
}

export function usePostStyles() {
  const {
    template: {postStyles},
  } = useSimpleBlog()

  return {
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
  }
}

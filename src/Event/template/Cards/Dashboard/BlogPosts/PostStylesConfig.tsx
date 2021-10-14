import TextField from '@material-ui/core/TextField'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Cards, useCards} from 'Event/template/Cards'
import {onChangeCheckedHandler, onChangeNumberHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import React, {useEffect, useMemo, useState} from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'

const MAX_SPACING = 250
const MIN_SPACING = 1

export default function PostStylesConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const {update} = useCards()

  const styles = usePostStyles()

  const [titleTextColor, setTitleTextColor] = useState(styles.titleTextColor)
  const [titleFontSize, setTitleFontSize] = useState(styles.titleFontSize)
  const [titleCapitalize, setTitleCapitalize] = useState(styles.titleCapitalize)
  const [dateTextColor, setDateTextColor] = useState(styles.dateTextColor)
  const [spacing, setSpacing] = useState(styles.spacing)
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
    setSpacing(styles.spacing)
  }, [isVisible, styles])

  const save = () => {
    const updated: Cards['postStyles'] = {
      titleTextColor,
      titleFontSize,
      titleCapitalize,
      dateTextColor,
      contentTextColor,
      contentFontSize,
      spacing,
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
      <InputLabel>Space Between Posts</InputLabel>
      <Slider
        min={MIN_SPACING}
        max={MAX_SPACING}
        step={1}
        onChange={handleChangeSlider(setSpacing)}
        valueLabelDisplay="auto"
        value={spacing}
      />
      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}

export function usePostStyles() {
  const {
    template: {postStyles},
  } = useCards()

  return useMemo(
    () => ({
      titleTextColor: postStyles.titleTextColor,
      titleFontSize: postStyles.titleFontSize,
      titleCapitalize: postStyles.titleCapitalize,
      dateTextColor: postStyles.dateTextColor,
      contentTextColor: postStyles.contentTextColor,
      contentFontSize: postStyles.contentFontSize,
      spacing: postStyles.spacing,
    }),
    [postStyles],
  )
}

import Box from '@material-ui/core/Box'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler} from 'lib/dom'
import {withDefault} from 'lib/template'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export const DEFAULT_LINK_UNDERLINE = true
export const DEFAULT_TEXT_COLOR = '#000000'
export const DEFAULT_LINK_COLOR = '#000000'

export default function GlobalStylesConfig() {
  const {template, update} = useSimpleBlog()

  return (
    <>
      <SectionTitle>Global Styles</SectionTitle>
      <ColorPicker
        label="Text Color"
        color={template.textColor}
        onPick={update.primitive('textColor')}
        aria-label="text color"
      />
      <ColorPicker
        label="Link Color"
        color={template.linkColor}
        onPick={update.primitive('linkColor')}
        aria-label="link color"
      />
      <Box mb={2}>
        <Switch
          label="Link Underline"
          checked={withDefault(DEFAULT_LINK_UNDERLINE, template.linkUnderline)}
          onChange={onChangeCheckedHandler(update.primitive('linkUnderline'))}
          labelPlacement="end"
          color="primary"
          aria-label="link underline"
        />
      </Box>
    </>
  )
}

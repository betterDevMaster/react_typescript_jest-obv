import Box from '@material-ui/core/Box'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'

export default function GlobalStylesConfig() {
  const {template, update} = useSimpleBlog()

  return (
    <Layout>
      <Page>
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
            checked={template.linkUnderline}
            onChange={onChangeCheckedHandler(update.primitive('linkUnderline'))}
            labelPlacement="end"
            color="primary"
            aria-label="link underline"
          />
        </Box>
      </Page>
    </Layout>
  )
}

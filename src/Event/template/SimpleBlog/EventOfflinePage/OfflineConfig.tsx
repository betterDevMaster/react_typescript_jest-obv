import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import TextEditor from 'lib/ui/form/TextEditor'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler, onChangeStringHandler} from 'lib/dom'
import EventOfflinePage from 'Event/template/SimpleBlog/EventOfflinePage'
import {withDefault} from 'lib/template'

export const DEFAULT_TITLE = 'Event Offline'
export const DEFAULT_DESCRIPTION =
  'Please check back again, or contact support for access.'

export default function OfflineConfig() {
  const {template, update: updateSimpleBlog} = useSimpleBlog()
  const update = updateSimpleBlog.object('offlinePage')
  const {offlinePage: settings} = template

  return (
    <>
      <SectionTitle>Event Offline Preferences</SectionTitle>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Switch
            label="Redirect to another URL?"
            checked={settings?.shouldRedirect}
            onChange={onChangeCheckedHandler(update('shouldRedirect'))}
            labelPlacement="end"
            color="primary"
            aria-label="is redirect"
          />
          <TextField
            label="Redirect URL"
            fullWidth
            value={settings?.redirectUrl}
            onChange={onChangeStringHandler(update('redirectUrl'))}
            inputProps={{'aria-label': 'redirect url'}}
          />
          <TextField
            label="Title"
            fullWidth
            value={withDefault(DEFAULT_TITLE, settings?.title)}
            onChange={onChangeStringHandler(update('title'))}
            inputProps={{'aria-label': 'offline page title'}}
          />
          <TextEditor
            data={withDefault(DEFAULT_DESCRIPTION, settings?.description)}
            onChange={update('description')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewBox>
            <EventOfflinePage isPreview />
          </PreviewBox>
        </Grid>
      </Grid>
    </>
  )
}

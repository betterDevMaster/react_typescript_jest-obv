import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import TextEditor from 'lib/ui/form/TextEditor'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import {useCards} from 'Event/template/Cards'
import {onChangeCheckedHandler, onChangeStringHandler} from 'lib/dom'
import EventOfflinePage from 'Event/template/Cards/EventOfflinePage'

export default function OfflineConfig() {
  const {template, update: updateCards} = useCards()
  const update = updateCards.object('offlinePage')
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
            value={settings.title}
            onChange={onChangeStringHandler(update('title'))}
            inputProps={{'aria-label': 'offline page title'}}
          />
          <TextEditor
            data={settings.description}
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

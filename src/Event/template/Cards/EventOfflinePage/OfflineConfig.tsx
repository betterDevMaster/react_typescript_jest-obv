import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import TextEditor from 'lib/ui/form/TextEditor'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import {onChangeCheckedHandler} from 'lib/dom'
import EventOfflinePage from 'Event/template/Cards/EventOfflinePage'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'

export default function OfflineConfig() {
  const template = useCardsTemplate()
  const update = useCardsUpdate()
  const {handleSubmit, control, register} = useForm()

  const {offlinePage: settings} = template

  const submit = (data: Pick<Cards, 'offlinePage'>) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Event Offline Preferences</SectionTitle>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <form onSubmit={handleSubmit(submit)}>
              <Controller
                name="offlinePage.shouldRedirect"
                defaultValue={settings.shouldRedirect}
                control={control}
                render={({value, onChange}) => (
                  <Switch
                    label="Redirect to another URL?"
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    labelPlacement="end"
                    color="primary"
                    aria-label="is redirect"
                  />
                )}
              />
              <TextField
                name="offlinePage.redirectUrl"
                label="Redirect URL"
                fullWidth
                defaultValue={settings.redirectUrl}
                inputProps={{'aria-label': 'redirect url', ref: register}}
              />
              <TextField
                name="offlinePage.title"
                label="Title"
                fullWidth
                defaultValue={settings.title}
                inputProps={{'aria-label': 'offline page title', ref: register}}
              />
              <Controller
                name="offlinePage.description"
                defaultValue={settings.description}
                control={control}
                render={({value, onChange}) => (
                  <TextEditor data={value} onChange={onChange} />
                )}
              />
              <Button
                variant="contained"
                aria-label="save"
                type="submit"
                color="primary"
              >
                Save
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <PreviewBox>
              <EventOfflinePage isPreview />
            </PreviewBox>
          </Grid>
        </Grid>
      </Page>
    </Layout>
  )
}

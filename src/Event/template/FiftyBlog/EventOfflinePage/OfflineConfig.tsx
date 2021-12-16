import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {onChangeCheckedHandler} from 'lib/dom'
import EventOfflinePage from 'Event/template/FiftyBlog/EventOfflinePage'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useForm, Controller} from 'react-hook-form'
import Button from '@material-ui/core/Button'

export default function OfflineConfig() {
  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()

  const {offlinePage} = template

  const {handleSubmit, control, register} = useForm()

  const submit = (data: Pick<FiftyBlog, 'offlinePage'>) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <form onSubmit={handleSubmit(submit)}>
          <SectionTitle>Event Offline Preferences</SectionTitle>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                name="offlinePage.shouldRedirect"
                defaultValue={offlinePage.shouldRedirect}
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
                label="Redirect URL"
                fullWidth
                name="offlinePage.redirectUrl"
                defaultValue={offlinePage.redirectUrl}
                inputProps={{
                  'aria-label': 'redirect url',
                  ref: register,
                }}
              />
              <TextField
                label="Title"
                fullWidth
                name="offlinePage.title"
                defaultValue={offlinePage.title}
                inputProps={{
                  'aria-label': 'offline page title',
                  ref: register,
                }}
              />

              <Controller
                name="offlinePage.description"
                defaultValue={offlinePage.description}
                control={control}
                render={({value, onChange}) => (
                  <TextEditorContainer>
                    <TextEditor data={value} onChange={onChange} />
                  </TextEditorContainer>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <PreviewBox>
                <EventOfflinePage isPreview />
              </PreviewBox>
            </Grid>
          </Grid>
        </form>
      </Page>
    </Layout>
  )
}

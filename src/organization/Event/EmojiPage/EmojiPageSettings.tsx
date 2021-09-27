import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {Controller, useForm} from 'react-hook-form'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useUpdate} from 'Event/EventProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {Template} from 'Event/template'
import {useTemplate} from 'Event/TemplateProvider'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import FormControl from '@material-ui/core/FormControl'

export default function EmojiPageSettings(props: {onComplete?: () => void}) {
  const template = useTemplate()
  const {emojiPage: current} = template
  const {control, handleSubmit} = useForm()
  const [processing, setProcessing] = useState(false)
  const updateEvent = useUpdate()
  const routes = useEventRoutes()

  const submit = (data: Template['emojiPage']) => {
    if (processing) {
      return
    }

    setProcessing(true)

    const updated = {
      ...template,
      emojiPage: {
        ...current,
        ...data,
      },
    }

    updateEvent({template: updated}).finally(() => {
      setProcessing(false)
      props.onComplete && props.onComplete()
    })
  }

  return (
    <Layout>
      <Page>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <RelativeLink
            to={routes.emoji.root}
            aria-label="view emoji page"
            newTab
            disableStyles
          >
            <Button variant="outlined">View Emojis</Button>
          </RelativeLink>
        </Box>
        <form onSubmit={handleSubmit(submit)}>
          <FormControl fullWidth>
            <Controller
              name="background"
              control={control}
              defaultValue={current.background}
              render={({value, onChange}) => (
                <BackgroundPicker
                  label="Background"
                  background={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
          <Button
            fullWidth
            color="primary"
            type="submit"
            disabled={processing}
            variant="contained"
            aria-label="save"
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

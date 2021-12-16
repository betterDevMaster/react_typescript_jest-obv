import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import withStyles from '@material-ui/core/styles/withStyles'
import {Box, Button, Typography} from '@material-ui/core'

import {ObvioEvent} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {Template} from 'Event/template'
import TemplateSelect from 'Event/template/TemplateSelect'

import {createSimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {createPanels, PANELS} from 'Event/template/Panels'
import {createCards, CARDS} from 'Event/template/Cards'
import {createFiftyBlog, FIFTY_BLOG} from 'Event/template/FiftyBlog'

import {useToggle} from 'lib/toggle'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'

import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'

export default function SelectTemplateForm() {
  const {control, handleSubmit} = useForm()
  const setTemplate = useSetTemplate()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const submit = (data: {name: Template['name']}) => {
    if (processing) {
      return
    }
    toggleProcessing()

    const template = createTemplate(data.name)

    setTemplate(template).catch(toggleProcessing)
  }

  return (
    <Layout>
      <Page>
        <Description>Pick a template below to get started...</Description>
        <form onSubmit={handleSubmit(submit)}>
          <Controller
            name="name"
            defaultValue={SIMPLE_BLOG}
            control={control}
            render={({value, onChange}) => (
              <TemplateSelect
                value={value}
                onPick={onChange}
                disabled={processing}
              />
            )}
          />
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={processing}
            >
              Create
            </Button>
          </Box>
        </form>
      </Page>
    </Layout>
  )
}

const Description = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Typography)

function createTemplate(name: Template['name']) {
  switch (name) {
    case SIMPLE_BLOG:
      return createSimpleBlog()
    case PANELS:
      return createPanels()
    case CARDS:
      return createCards()
    case FIFTY_BLOG:
      return createFiftyBlog()
    default:
      throw new Error(`New template not defined for: ${name}`)
  }
}

function useSetTemplate() {
  const {event, set: setEvent} = useEvent()
  const url = api(`/events/${event.slug}/template`)
  const {client} = useOrganization()

  return (template: Template) =>
    client
      .post<ObvioEvent>(url, {template})
      .then(setEvent)
}

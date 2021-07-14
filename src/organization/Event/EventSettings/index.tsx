import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import Page, {rootEventBreadcrumbs} from 'organization/Event/Page'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {useForm} from 'react-hook-form'
import {ValidationError} from 'lib/api-client'
import {useOrganization} from 'organization/OrganizationProvider'
import {routesWithValue} from 'lib/url'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Form, {UpdateEventData} from 'organization/Event/EventSettings/Form'
import {useFileSelect} from 'lib/ui/form/file'

export default function UpdateEventForm() {
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<UpdateEventData>
  >(null)
  const {event} = useEvent()
  const {routes: organizationRoutes} = useOrganization()
  const {register, handleSubmit, watch, errors: formErrors, control} = useForm()
  const {set: setBreadcrumbs} = useBreadcrumbs()
  const update = useUpdate()

  const favicon = useFileSelect(event.favicon)

  const data = (form: UpdateEventData) => {
    if (favicon.selected) {
      const formData = new FormData()
      for (const [key, value] of Object.entries(form)) {
        formData.set(key, String(value))
      }

      formData.set('favicon', favicon.selected)
      return formData
    }

    if (favicon.wasRemoved) {
      return {
        ...form,
        favicon: null,
      }
    }

    return form
  }

  const submit = (form: UpdateEventData) => {
    if (submitting) {
      return
    }

    setSubmitting(true)
    setResponseError(null)

    update(data(form))
      .then((updated) => {
        const routes = routesWithValue(
          ':event',
          updated.slug,
          organizationRoutes.events[':event'],
        )

        setBreadcrumbs(
          rootEventBreadcrumbs(organizationRoutes, routes, updated),
        )
        // Update slug in URL without triggering reload
        window.history.replaceState(null, '', routes.root)
      })
      .catch((error) => {
        setResponseError(error)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Layout>
      <Page>
        <Form
          onSubmit={handleSubmit(submit)}
          register={register}
          formErrors={formErrors}
          responseError={responseError}
          slug={watch('slug')}
          submitLabel="Save"
          submitting={submitting}
          control={control}
          favicon={favicon}
        />
      </Page>
    </Layout>
  )
}

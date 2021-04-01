import React, {useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import Page, {rootEventBreadcrumbs} from 'organization/Event/Page'
import {useEvent} from 'Event/EventProvider'
import {useForm} from 'react-hook-form'
import {useIsMounted} from 'lib/dom'
import Form, {EventData} from 'organization/EventList/CreateEventForm/Form'
import {ValidationError} from 'lib/api-client'
import {upToMinutes} from 'lib/date-time'
import {useOrganization} from 'organization/OrganizationProvider'
import {api, routesWithValue} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'

export default function UpdateEventForm() {
  const [submitting, setSubmitting] = useState(false)
  const isMounted = useIsMounted()
  const [responseError, setResponseError] = useState<
    ValidationError<EventData>
  >(null)
  const {update: setEvent} = useEvent()
  const {event} = useEvent()
  const {routes: organizationRoutes} = useOrganization()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors: formErrors,
  } = useForm()
  const {set: setBreadcrumbs} = useBreadcrumbs()
  const update = useUpdate()

  useEffect(() => {
    if (!isMounted.current) {
      return
    }

    setValue('name', event.name)
    setValue('slug', event.slug)
    setValue('start', upToMinutes(event.start))
    setValue('end', upToMinutes(event.end))
    setValue('num_attendees', event.num_attendees)
  }, [event, setValue, isMounted])

  const submit = (data: EventData) => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    update(data)
      .then((updated) => {
        const routes = routesWithValue(
          ':event',
          updated.slug,
          organizationRoutes.events[':event'],
        )
        setEvent(updated)

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

  const name = watch('name')
  const slug = watch('slug')
  const start = watch('start')
  const end = watch('end')
  const numAttendees = watch('num_attendees')

  const hasChanges =
    name !== event.name ||
    slug !== event.slug ||
    start !== upToMinutes(event.start) ||
    end !== upToMinutes(event.end) ||
    numAttendees !== String(event.num_attendees)

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
          canSave={hasChanges}
        />
      </Page>
    </Layout>
  )
}

function useUpdate() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}`)

  return (data: Partial<ObvioEvent>) => client.put<ObvioEvent>(url, data)
}

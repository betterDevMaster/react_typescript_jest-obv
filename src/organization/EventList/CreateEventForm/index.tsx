import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {Client, ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'
import {Organization} from 'organization'
import Page from 'organization/user/Layout/Page'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Form, {EventData} from 'organization/EventList/CreateEventForm/Form'

export default function CreateEventForm() {
  const {register, errors: formErrors, handleSubmit, watch} = useForm()
  const slug = watch('slug')
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<EventData>
  >(null)
  const history = useHistory()
  const {routes, organization, client} = useOrganization()

  useBreadcrumbs([{title: 'Events', url: routes.events.root}])

  const goToEvents = () => {
    history.push(routes.events.root)
  }

  const submit = (data: EventData) => {
    setSubmitting(true)
    createEvent(client, organization, data)
      .then(() => {
        goToEvents()
      })
      .catch((error) => {
        setResponseError(error)
        setSubmitting(false)
      })
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5" align="center">
          Create Your Event
        </Title>
        <Form
          onSubmit={handleSubmit(submit)}
          register={register}
          submitting={submitting}
          slug={slug}
          formErrors={formErrors}
          responseError={responseError}
          submitLabel="Submit"
        />
      </Page>
    </Layout>
  )
}

function createEvent(
  client: Client,
  organization: Organization,
  data: EventData,
) {
  const url = api(`/organizations/${organization.slug}/events`)
  return client.post<ObvioEvent>(url, data)
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

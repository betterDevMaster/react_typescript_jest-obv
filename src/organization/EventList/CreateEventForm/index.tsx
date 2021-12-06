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
import Page from 'lib/ui/layout/Page'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Form, {
  CreateEventData,
} from 'organization/EventList/CreateEventForm/Form'

export default function CreateEventForm() {
  const {
    register,
    errors: formErrors,
    handleSubmit,
    watch,
    control,
    setValue,
  } = useForm()
  const slug = watch('slug')
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<CreateEventData>
  >(null)
  const history = useHistory()
  const {routes, organization, client} = useOrganization()
  const [hasEndDateTimeChange, setHasEndDateTimeChange] = useState(false)
  useBreadcrumbs([{title: 'Events', url: routes.events.root}])

  const goToEvents = () => {
    history.push(routes.events.root)
  }

  const submit = (data: CreateEventData) => {
    setSubmitting(true)
    createEvent(client, organization, data)
      .then(() => {
        goToEvents()
      })
      .catch((error) => {
        setResponseError(error)
        setSubmitting(false)
        setHasEndDateTimeChange(false)
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
          control={control}
          setValue={setValue}
          setHasEndDateTimeChange={setHasEndDateTimeChange}
          hasEndDateTimeChange={hasEndDateTimeChange}
        />
      </Page>
    </Layout>
  )
}

function createEvent(
  client: Client,
  organization: Organization,
  data: CreateEventData,
) {
  const url = api(`/organizations/${organization.id}/events`)
  return client.post<ObvioEvent>(url, data)
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

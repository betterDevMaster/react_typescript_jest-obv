import {ValidationError} from 'lib/api-client'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import Layout from 'organization/user/Layout'
import {Organization} from 'organization'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useOrganization} from 'organization/OrganizationProvider'
import {fieldError} from 'lib/form'
import Form from 'organization/Settings/Form'
import {Redirect} from 'react-router-dom'
import {useIsOwner} from 'organization/OwnerProvider'
import Page from 'lib/ui/layout/Page'

export interface Data {
  name: string
  slug: string
}

export default function Settings() {
  const {register, errors, handleSubmit} = useForm()
  const [serverError, setServerError] = useState<ValidationError<Data>>(null)
  const [submitting, setSubmitting] = useState(false)
  const {organization, routes: organizationRoutes, set} = useOrganization()
  const isOwner = useIsOwner()

  useBreadcrumbs([{title: 'Settings', url: organizationRoutes.settings}])

  if (!isOwner) {
    return <Redirect to={organizationRoutes.events.root} />
  }

  const submit = (data: Data) => {
    setSubmitting(true)
    sendRequest(data, organization.id)
      .then(set)
      .catch((error) => {
        setServerError(error)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {
    form: errors,
    response: serverError,
  })

  return (
    <Layout>
      <Page>
        <Form
          onSubmit={handleSubmit(submit)}
          submitting={submitting}
          serverError={serverError}
          nameError={nameError}
          register={register}
        />
      </Page>
    </Layout>
  )
}

function sendRequest(data: Data, id: number) {
  const url = api(`/organizations/${id}`)
  return teamMemberClient.put<Organization>(url, data)
}

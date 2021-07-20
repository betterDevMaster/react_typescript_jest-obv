import {ValidationError} from 'lib/api-client'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import Layout from 'organization/user/Layout'
import {Organization} from 'organization'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {
  useOrganization,
  createRoutesFor,
} from 'organization/OrganizationProvider'
import Page from 'organization/user/Layout/Page'
import {fieldError} from 'lib/form'

import Form from 'organization/Settings/Form'
import {appRoot} from 'env'
import Box from '@material-ui/core/Box'
import {Redirect, useHistory} from 'react-router-dom'
import {useIsOwner} from 'organization/OwnerProvider'

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
  const history = useHistory()

  useBreadcrumbs([{title: 'Settings', url: organizationRoutes.settings}])

  if (!isOwner) {
    return <Redirect to={organizationRoutes.events.root} />
  }

  const submit = (data: Data) => {
    setSubmitting(true)
    sendRequest(data, organization.slug)
      .then((updated) => {
        set(updated)

        const changedSlug = updated.slug !== organization.slug
        if (!changedSlug) {
          setSubmitting(false)
          return
        }

        const newRoutes = createRoutesFor(updated)
        history.push(newRoutes.settings)
      })
      .catch((error) => {
        setServerError(error)
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {
    form: errors,
    response: serverError,
  })

  const slugError = fieldError('slug', {
    form: errors,
    response: serverError,
  })

  const slugHelperText = () => {
    if (slugError) {
      return slugError
    }
    if (!slugError) {
      return 'Your organization slug will be a part of your domain'
    }
    return `Your organization will be accessible at: ${appRoot}/organization/${organization.slug}`
  }

  return (
    <Layout>
      <Page>
        <Box pt={5}>
          <Form
            onSubmit={handleSubmit(submit)}
            submitting={submitting}
            serverError={serverError}
            nameError={nameError}
            slugError={slugError}
            slugHelperText={slugHelperText}
            register={register}
          />
        </Box>
      </Page>
    </Layout>
  )
}

function sendRequest(data: Data, slug: string) {
  const url = api(`/organizations/${slug}`)
  return teamMemberClient.put<Organization>(url, data)
}

import {ValidationError} from 'lib/ui/api-client'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import Layout from 'organization/user/Layout'
import {Organization} from 'organization'
import React, {useState} from 'react'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import {useOrganization} from 'organization/OrganizationProvider'
import {useIsOwner, useOwner} from 'organization/OwnerProvider'
import {fieldError} from 'lib/form'
import Form from 'organization/Settings/Form'
import Button from '@material-ui/core/Button'
import Page from 'lib/ui/layout/Page'
import Subheading from 'lib/ui/typography/Subheading'
import Divider from 'lib/ui/layout/Divider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

import OrganizationCreditBalance from 'obvio/Billing/OrganizationCreditBalance'

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
  const {owner} = useOwner()

  useBreadcrumbs([{title: 'Settings', url: organizationRoutes.settings}])

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
        <OrganizationSettings showing={isOwner}>
          <Section>
            <Form
              onSubmit={handleSubmit(submit)}
              submitting={submitting}
              serverError={serverError}
              nameError={nameError}
              register={register}
            />
          </Section>
          <Divider />
        </OrganizationSettings>
        <Section>
          <Subheading>Credits</Subheading>
          <OrganizationCreditBalance />
          <PurchaseCreditsLink
            to={organizationRoutes.buy_credits}
            disableStyles
            hidden={!owner.has_payment_method}
            aria-label="purchase credit link"
          >
            <Button variant="contained" color="primary">
              Purchase Credits
            </Button>
          </PurchaseCreditsLink>
        </Section>
      </Page>
    </Layout>
  )
}

function sendRequest(data: Data, id: number) {
  const url = api(`/organizations/${id}`)
  return teamMemberClient.put<Organization>(url, data)
}

const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[16]};
`

const PurchaseCreditsLink = styled(RelativeLink)<{hidden?: boolean}>`
  margin-top: ${(props) => props.theme.spacing[4]};
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`

const OrganizationSettings = styled.div<{showing: boolean}>`
  display: ${(props) => (props.showing ? 'block' : 'none')};
`

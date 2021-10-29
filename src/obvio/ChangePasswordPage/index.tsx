import React from 'react'
import {obvioRoutes} from 'obvio/Routes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Layout from 'obvio/user/Layout'
import Form from 'obvio/ChangePasswordPage/Form'

export default function ChangePasswordPage() {
  useBreadcrumbs([
    {
      title: 'Change Password',
      url: obvioRoutes.change_password,
    },
  ])

  return (
    <Layout>
      <Form />
    </Layout>
  )
}

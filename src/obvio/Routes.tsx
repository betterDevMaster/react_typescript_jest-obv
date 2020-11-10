import Login from 'obvio/auth/Login'
import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {Redirect, Route, Switch} from 'react-router-dom'
import Home from 'obvio/user/Home'
import Registration from 'obvio/auth/Registration'
import {createRoutes} from 'lib/url'
import Layout from 'obvio/user/Layout'
import CreateOrganizationForm from 'obvio/user/Organizations/CreateOrganizationForm'

export const obvioRoutes = createRoutes({
  home: '/home',
  login: '/login',
  registration: '/register',
  organizations: {
    create: '/create',
  },
})

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <AuthenticatedRoutes />
  }

  return <GuestRoutes />
}

function AuthenticatedRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={obvioRoutes.home}>
          <Home />
        </Route>
        <Route path={obvioRoutes.organizations.create}>
          <CreateOrganizationForm />
        </Route>
        <Redirect
          to={{
            pathname: obvioRoutes.home,
          }}
        />
      </Switch>
    </Layout>
  )
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.login}>
        <Login />
      </Route>
      <Route path={obvioRoutes.registration}>
        <Registration />
      </Route>
      <Redirect
        to={{
          pathname: obvioRoutes.login,
        }}
      />
    </Switch>
  )
}

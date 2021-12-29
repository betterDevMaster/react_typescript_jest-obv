import AuthorizedPage from 'organization/AuthorizedPage'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import React from 'react'
import {Route} from 'react-router-dom'
import LoginPageConfig from 'Event/template/NiftyFifty/Login/LoginConfig'
import OfflinePageConfig from 'Event/template/NiftyFifty/EventOfflinePage/OfflineConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import CreatePasswordPageConfig from 'Event/template/NiftyFifty/Step1/SetPasswordFormConfig'
import GlobalStylesConfig from 'Event/template/NiftyFifty/GlobalStylesConfig'
import CheckInConfig from 'Event/template/NiftyFifty/check-in/CheckInConfig'

export default function NiftyFiftyConfigRoutes() {
  const {routes} = useOrganization()

  return (
    <>
      <Route path={routes.events[':event'].login}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <LoginPageConfig />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events[':event'].event_offline}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <OfflinePageConfig />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events[':event'].password_create}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <CreatePasswordPageConfig />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events[':event'].check_in}>
        <CheckInConfig />
      </Route>
      <Route path={routes.events[':event'].global_styles}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <GlobalStylesConfig />
        </AuthorizedPage>
      </Route>
    </>
  )
}

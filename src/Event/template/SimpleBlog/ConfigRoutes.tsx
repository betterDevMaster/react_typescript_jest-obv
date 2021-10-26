import AuthorizedPage from 'organization/AuthorizedPage'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import React from 'react'
import {Route} from 'react-router-dom'
import LoginPageConfig from 'Event/template/SimpleBlog/Login/LoginConfig'
import OfflinePageConfig from 'Event/template/SimpleBlog/EventOfflinePage/OfflineConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import CreatePasswordPageConfig from 'Event/template/SimpleBlog/Step1/SetPasswordFormConfig'
import ProgressBarConfig from 'Event/template/SimpleBlog/ProgressBarConfig'
import GlobalStylesConfig from 'Event/template/SimpleBlog/GlobalStylesConfig'

export default function SimpleBlogConfigRoutes() {
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
      <Route path={routes.events[':event'].progress_bar}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <ProgressBarConfig />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events[':event'].global_styles}>
        <AuthorizedPage permission={CONFIGURE_EVENTS}>
          <GlobalStylesConfig />
        </AuthorizedPage>
      </Route>
    </>
  )
}

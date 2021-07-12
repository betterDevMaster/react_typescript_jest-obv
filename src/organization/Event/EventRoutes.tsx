import DashboardConfig from 'organization/Event/DashboardConfig'
import WaiverConfig from 'organization/Event/WaiverConfig'
import TechCheckConfig from 'organization/Event/TechCheckConfig'
import AttendeeManagement from 'organization/Event/AttendeeManagement'
import Emoji from 'organization/Event/EmojiPage'
import SpeakerPageConfig from 'organization/Event/SpeakerPageConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import CreateAreaForm from 'organization/Event/AreaList/CreateAreaForm'
import {ObvioEvent} from 'Event'
import {useParamEventSlug} from 'Event/url'
import {routesWithValue} from 'lib/url'
import {AreaProvider} from 'organization/Event/Area/AreaProvider'
import AreaRoutes from 'organization/Event/Area/AreaRoutes'
import PointsConfig from 'organization/Event/PointsConfig'
import GeneralConfig from 'organization/Event/GeneralConfig'
import LocalizationConfig from 'organization/Event/LocalizationConfig'
import AttendeesProvider from 'organization/Event/AttendeesProvider'
import Services from 'organization/Event/Services'
import Zapier from 'organization/Event/Services/Apps/Zapier'
import ServicesProvider from 'organization/Event/Services/ServicesProvider'
import AreasProvider from 'organization/Event/AreasProvider'
import FormsConfig from 'organization/Event/FormsConfig'
import Infusionsoft from 'organization/Event/Services/Apps/Infusionsoft'
import AuthorizedPage from 'organization/AuthorizedPage'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import NameAppendageConfig from 'organization/Event/NameAppendageConfig'
import Event from 'organization/Event'
import AreaList from 'organization/Event/AreaList'
import {HideLiveChatSupport} from 'lib/WithLiveChatSupport'
import SponsorPageConfig from 'organization/Event/SponsorPageConfig'
import FaqPageConfig from 'organization/Event/FaqPageConfig'
import Form from 'organization/Event/Form'
import {FormProvider} from 'organization/Event/Form/FormProvider'
import {useEvent} from 'Event/EventProvider'
import SelectTemplateForm from 'organization/Event/SelectTemplateForm'
import TemplateProvider from 'Event/TemplateProvider'
import SponsorsProvider from 'organization/Event/SponsorsProvider'
import FaqsProvider from 'organization/Event/FaqsProvider'
import SpeakersProvider from 'organization/Event/SpeakersProvider'
import NameAppendageProvider from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import Reports from 'organization/Event/Reports'
import ReportsProvider from 'organization/Event/ReportsProvider'
import BackgroundsProvider from 'organization/Event/Backgrounds/BackgroundsProvider'
import Backgrounds from 'organization/Event/Backgrounds'
import {StaticPointsProvider} from 'Event/PointsProvider'

export type EventRoutes = ReturnType<typeof useEventRoutes>

export function useEventRoutes(event?: ObvioEvent) {
  const {routes: organizationRoutes} = useOrganization()
  const slug = useParamEventSlug()
  const value = event ? event.slug : slug

  return routesWithValue(':event', value, organizationRoutes.events[':event'])
}

export default function EventRoutes() {
  const {routes} = useOrganization()
  const {event} = useEvent()

  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <TemplateProvider template={event.template}>
      <StaticPointsProvider>
        <Switch>
          <Route path={routes.events[':event'].root} exact>
            <Event />
          </Route>
          <Route path={routes.events[':event'].areas.root} exact>
            <AreasProvider>
              <AreaList />
            </AreasProvider>
          </Route>
          <Route path={routes.events[':event'].dashboard}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <AreasProvider>
                <DashboardConfig />
              </AreasProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].waiver}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <WaiverConfig />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].forms[':form'].root}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <FormProvider>
                <Form />
              </FormProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].forms.root}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <FormsConfig />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].tech_check}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <AreasProvider>
                <TechCheckConfig />
              </AreasProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].attendees}>
            <AttendeesProvider>
              <AreasProvider>
                <AttendeeManagement />
              </AreasProvider>
            </AttendeesProvider>
          </Route>
          <Route path={routes.events[':event'].emoji}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <HideLiveChatSupport>
                <Emoji />
              </HideLiveChatSupport>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].speakers}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <SpeakersProvider>
                <SpeakerPageConfig />
              </SpeakersProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].sponsors}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <AreasProvider>
                <SponsorsProvider>
                  <SponsorPageConfig />
                </SponsorsProvider>
              </AreasProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].faqs}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <AreasProvider>
                <FaqsProvider>
                  <FaqPageConfig />
                </FaqsProvider>
              </AreasProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].points}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <PointsConfig />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].general}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <GeneralConfig />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].localization}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <LocalizationConfig />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].services.root}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <ServicesProvider>
                <ServiceRoutes />
              </ServicesProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].backgrounds}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <BackgroundsProvider>
                <Backgrounds />
              </BackgroundsProvider>
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].areas.create}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <CreateAreaForm />
            </AuthorizedPage>
          </Route>
          <Route path={routes.events[':event'].areas[':area'].root}>
            <AreaProvider>
              <AreaRoutes />
            </AreaProvider>
          </Route>
          <Route path={routes.events[':event'].name_appendage}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <NameAppendageProvider>
                <NameAppendageConfig />
              </NameAppendageProvider>
            </AuthorizedPage>
          </Route>
          reports
          <Route path={routes.events[':event'].reports}>
            <AuthorizedPage permission={CONFIGURE_EVENTS}>
              <ReportsProvider>
                <Reports />
              </ReportsProvider>
            </AuthorizedPage>
          </Route>
          <Redirect to={routes.events[':event'].root} />
        </Switch>
      </StaticPointsProvider>
    </TemplateProvider>
  )
}

function ServiceRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].services.zapier}>
        <Zapier />
      </Route>
      <Route path={routes.events[':event'].services.infusionsoft}>
        <Infusionsoft />
      </Route>
      <Route path={routes.events[':event'].services.root}>
        <Services />
      </Route>
    </Switch>
  )
}

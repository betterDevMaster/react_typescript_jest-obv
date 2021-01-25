import React from 'react'
import {
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
} from '@testing-library/react'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import MockStoreProvider from 'store/__utils__/MockStoreProvider'
import Providers from 'Providers'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {Organization} from 'organization'
import StaticOrganizationProvider from 'organization/__utils__/StaticOrganizationProvider'
import {Attendee} from 'Event/attendee'
import {Action} from 'Event/ActionsProvider'
import StaticActionsProvider from 'Event/ActionsProvider/__utils__/StaticActionsProvider'
import {Score} from 'Event/PointsProvider'
import StaticPointsProvider from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {BrowserRouter as Router} from 'react-router-dom'

type Options = Omit<RtlRenderOptions, 'queries'> & {
  event?: ObvioEvent
  organization?: Organization
  attendee?: Attendee
  actions?: {
    platform: Action[]
    custom: Action[]
  }
  score?: Score
  withRouter?: boolean
}

export const render = (
  component: React.ReactElement,
  options: Options = {},
) => {
  const wrapped = (target: React.ReactElement, options?: Options) => {
    const groups = options?.attendee ? options.attendee.groups : {}
    const tags = options?.attendee ? options.attendee.tags : []

    return (
      <Providers storeProvider={MockStoreProvider}>
        <WithRouter withRouter={options?.withRouter}>
          <WithOrganization organization={options?.organization}>
            <WithEvent event={options?.event}>
              <WithActions actions={options?.actions}>
                <WithPoints score={options?.score}>
                  <AttendeeProfileProvider tags={tags} groups={groups}>
                    {target}
                  </AttendeeProfileProvider>
                </WithPoints>
              </WithActions>
            </WithEvent>
          </WithOrganization>
        </WithRouter>
      </Providers>
    )
  }

  const {rerender: rtlRerender, ...renderResult} = rtlRender(
    wrapped(component, options),
    options,
  )

  const rerender = (component: React.ReactElement, newOptions?: Options) => {
    const updatedOptions = {...options, ...newOptions}

    return rtlRerender(wrapped(component, updatedOptions))
  }

  return {
    rerender,
    ...renderResult,
  }
}

function WithEvent(props: {event?: ObvioEvent; children: React.ReactElement}) {
  if (!props.event) {
    return props.children
  }

  return (
    <StaticEventProvider event={props.event}>
      {props.children}
    </StaticEventProvider>
  )
}

function WithRouter(props: {
  withRouter?: boolean
  children: React.ReactElement
}) {
  if (!props.withRouter) {
    return props.children
  }

  return <Router>{props.children}</Router>
}

function WithOrganization(props: {
  organization?: Organization
  children: React.ReactElement
}) {
  if (!props.organization) {
    return props.children
  }

  return (
    <StaticOrganizationProvider organization={props.organization}>
      {props.children}
    </StaticOrganizationProvider>
  )
}

export const emptyActions = {
  platform: [],
  custom: [],
}

function WithActions(props: {
  actions?: {platform: Action[]; custom: Action[]}
  children: React.ReactElement
}) {
  if (!props.actions) {
    return props.children
  }

  return (
    <StaticActionsProvider actions={props.actions}>
      {props.children}
    </StaticActionsProvider>
  )
}

function WithPoints(props: {score?: Score; children: React.ReactElement}) {
  if (!props.score) {
    return props.children
  }

  return (
    <StaticPointsProvider score={props.score}>
      {props.children}
    </StaticPointsProvider>
  )
}

export function renderWithEvent(
  component: React.ReactElement,
  event: ObvioEvent = fakeEvent(),
) {
  const {rerender: rtlRerender, ...renderResult} = render(
    <StaticEventProvider event={event}>{component}</StaticEventProvider>,
  )

  const rerender = (
    component: React.ReactElement,
    newEvent: ObvioEvent = fakeEvent(),
  ) => {
    return rtlRerender(
      <StaticEventProvider event={newEvent || event}>
        {component}
      </StaticEventProvider>,
    )
  }

  return {...renderResult, rerender}
}

// Need to use nextSibling because of material UI bug not adding label to input
// https://github.com/mui-org/material-ui/issues/22950
export const inputElementFor = (select: HTMLElement) =>
  select.nextSibling as HTMLInputElement

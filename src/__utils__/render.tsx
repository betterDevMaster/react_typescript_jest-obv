import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import MockStoreProvider from 'store/__utils__/MockStoreProvider'
import Providers from 'Providers'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'

export const render = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const {rerender: rtlRerender, ...renderResult} = rtlRender(
    <Providers storeProvider={MockStoreProvider}>
      <AttendeeProfileProvider tags={[]} groups={{}}>
        {component}
      </AttendeeProfileProvider>
    </Providers>,
    options,
  )

  const rerender = (component: React.ReactElement) => {
    return rtlRerender(
      <Providers storeProvider={MockStoreProvider}>
        <AttendeeProfileProvider tags={[]} groups={{}}>
          {component}
        </AttendeeProfileProvider>
      </Providers>,
    )
  }

  return {
    rerender,
    ...renderResult,
  }
}

export function renderWithEvent(
  component: React.ReactElement,
  {event}: {event: ObvioEvent} = {event: fakeEvent()},
) {
  const {rerender: rtlRerender, ...renderResult} = render(
    <StaticEventProvider event={event}>{component}</StaticEventProvider>,
  )

  const rerender = (component: React.ReactElement) => {
    return rtlRerender(
      <StaticEventProvider event={event}>{component}</StaticEventProvider>,
    )
  }

  return {...renderResult, rerender}
}

// Need to use nextSibling because of material UI bug not adding label to input
// https://github.com/mui-org/material-ui/issues/22950
export const inputElementFor = (select: HTMLElement) =>
  select.nextSibling as HTMLInputElement

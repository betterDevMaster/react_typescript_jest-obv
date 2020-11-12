import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import {Providers} from 'App'
import RulesProvider from 'organization/event/Dashboard/component-rules/RulesProvider'

export const render = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const {rerender: rtlRerender, ...renderResult} = rtlRender(
    <Providers>
      <RulesProvider tags={[]} groups={{}}>
        {component}
      </RulesProvider>
    </Providers>,
    options,
  )

  const rerender = (component: React.ReactElement) => {
    return rtlRerender(
      <Providers>
        <RulesProvider tags={[]} groups={{}}>
          {component}
        </RulesProvider>
      </Providers>,
    )
  }

  return {
    rerender,
    ...renderResult,
  }
}

// Need to use nextSibling because of material UI bug not adding label to input
// https://github.com/mui-org/material-ui/issues/22950
export const inputElementFor = (select: HTMLElement) =>
  select.nextSibling as HTMLInputElement

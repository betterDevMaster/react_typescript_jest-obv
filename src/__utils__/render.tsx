import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import {Providers} from 'App'

export const render = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const {rerender: rtlRerender, ...renderResult} = rtlRender(
    <Providers>{component}</Providers>,
    options,
  )

  const rerender = (component: React.ReactElement) => {
    return rtlRerender(<Providers>{component}</Providers>)
  }

  return {
    rerender,
    ...renderResult,
  }
}

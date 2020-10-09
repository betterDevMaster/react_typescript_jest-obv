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

// Need to use nextSibling because of material UI bug not adding label to input
// https://github.com/mui-org/material-ui/issues/22950
export const inputElementFor = (select: HTMLElement) =>
  select.nextSibling as HTMLInputElement

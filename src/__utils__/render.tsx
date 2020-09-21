import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import ThemeProvider from 'system/ui/theme/ThemeProvider'

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

function Providers(props: {children: React.ReactElement}) {
  return <ThemeProvider>{props.children}</ThemeProvider>
}

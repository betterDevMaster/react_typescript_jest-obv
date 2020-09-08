import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import ThemeProvider from 'ui/theme/ThemeProvider'

export const render = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => rtlRender(<ThemeProvider>{component}</ThemeProvider>, options)

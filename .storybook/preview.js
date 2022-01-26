import React from 'react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {BrowserRouter as Router} from 'react-router-dom'
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
export const parameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*',
    storySort: {
      method: 'alphabetical',
    },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      breakpointSmall: {
        name: 'Breakpoint small (width: 320px)',
        styles: {
          height: '568px',
          width: '320px',
        },
      },
      breakpointMedium: {
        name: 'Breakpoint medium (width: 768px)',
        styles: {
          height: '1024px',
          width: '768px',
        },
      },
      breakpointLarge: {
        name: 'Breakpoint large (width: 1024px)',
        styles: {
          height: '768px',
          width: '1024px',
        },
      },
      breakpointExtraLarge: {
        name: 'Breakpoint extra large (width: 1280px)',
        styles: {
          height: '800px',
          width: '1280px',
        },
      },
    },
  },
}

//Here define global decorators( some providers)
export const decorators = [
  (Story) => (
    <Router>
      <GlobalStyles />
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </Router>
  ),
]

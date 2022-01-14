import React from 'react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {BrowserRouter as Router} from 'react-router-dom'
export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

//Here define global decorators( some providers)
export const decorators = [
  (Story) => (
    <Router>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </Router>
  ),
]

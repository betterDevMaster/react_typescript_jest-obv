import React from 'react'
import {render} from '@testing-library/react'
import App from 'App'
import {fakeSimpleBlog} from 'Dashboard/templates/__utils__/factory'

it('should show the welcome text', async () => {
  const dashboard = fakeSimpleBlog()
  //@ts-ignore
  window.OBV_DASHBOARD = dashboard
  const {findByText} = render(<App />)
  expect(await findByText(dashboard.welcomeText)).toBeInTheDocument()
})

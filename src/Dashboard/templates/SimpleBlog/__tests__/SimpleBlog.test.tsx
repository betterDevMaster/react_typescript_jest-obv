import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import App from 'App'
import {fakeSimpleBlog} from 'Dashboard/templates/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'

it('should show the welcome text', async () => {
  const dashboard = fakeSimpleBlog()
  //@ts-ignore
  window.OBV_DASHBOARD = dashboard
  //@ts-ignore
  window.OBV_USER = fakeUser()
  const {findByText} = render(<App />)
  expect(await findByText(dashboard.welcomeText)).toBeInTheDocument()
})

it('should show the user email', async () => {
  //@ts-ignore
  window.OBV_DASHBOARD = fakeSimpleBlog()
  const user = fakeUser()
  //@ts-ignore
  window.OBV_USER = user
  const {findByText, findByTestId} = render(<App />)

  const menuButton = await findByTestId('menu-button')
  fireEvent.click(menuButton)
  expect(await findByText(new RegExp(user.email))).toBeInTheDocument()
})

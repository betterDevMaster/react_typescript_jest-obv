import React from 'react'
import faker from 'faker'
import {render, fireEvent} from '@testing-library/react'
import App from 'App'
import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'

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

it('should render main nav buttons', async () => {
  const mainNavButtons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeMainNavButton,
  )

  //@ts-ignore
  window.OBV_DASHBOARD = fakeSimpleBlog({
    mainNavButtons,
  })
  const user = fakeUser()
  //@ts-ignore
  window.OBV_USER = user
  const {findAllByLabelText} = render(<App />)

  const buttons = await findAllByLabelText('main nav button')
  expect(buttons.length).toBe(mainNavButtons.length)
})

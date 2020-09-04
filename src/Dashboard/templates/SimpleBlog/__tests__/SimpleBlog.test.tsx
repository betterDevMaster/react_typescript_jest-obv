import React from 'react'
import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import {render} from '@testing-library/react'
import App from 'App'
import faker from 'faker'

it('should show the welcome text', async () => {
  const welcomeText = faker.lorem.sentence()

  const data: SimpleBlogDashboard = {
    template: SIMPLE_BLOG,
    welcomeText,
  }

  //@ts-ignore
  window.EVENT_DATA = data
  const {findByText} = render(<App />)
  expect(await findByText(welcomeText)).toBeInTheDocument()
})

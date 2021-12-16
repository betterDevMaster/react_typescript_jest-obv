import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import React from 'react'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {wait} from '@testing-library/react'

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show offline page', async () => {
  const title = 'Event is currently offline'
  const description = faker.lorem.sentence()

  const event = fakeEvent({
    is_online: false,

    template: fakeFiftyBlog({
      offlinePage: {
        title: title,
        description,
        redirectUrl: '',
        shouldRedirect: false,
      },
    }),
  })

  visitEventSite({event})

  const {findByText} = render(<App />)

  expect(await findByText(title)).toBeInTheDocument()
  expect(await findByText(description)).toBeInTheDocument()
})

it('should should redirect to url', async () => {
  const redirectUrl = 'http://redirecthere.com'

  const event = fakeEvent({
    is_online: false,

    template: fakeFiftyBlog({
      offlinePage: {
        redirectUrl,
        shouldRedirect: true,
        title: faker.lorem.word(),
        description: faker.lorem.sentence(),
      },
    }),
  })

  visitEventSite({event})

  render(<App />)

  await wait(() => {
    expect(window.location.href).toBe(redirectUrl)
  })
})

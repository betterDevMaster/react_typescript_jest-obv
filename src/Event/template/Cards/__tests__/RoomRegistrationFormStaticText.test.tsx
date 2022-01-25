import React from 'react'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import {render} from '__utils__/render'
import App from 'App'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'

beforeEach(() => {
  jest.clearAllMocks()
})

// EVENT TEMP CODE
it('should show static text for breakthrough event', async () => {
  const event = fakeEvent({
    template: fakeCards(),
    slug: 'breakthrough',
  })
  const token = 'secretregistrationtoken'

  visitEventSite({event, pathname: '/room', search: `?token=${token}`})

  const {findByText} = render(<App />)

  expect(await findByText(/Breakthrough 2022/i)).toBeInTheDocument()
})

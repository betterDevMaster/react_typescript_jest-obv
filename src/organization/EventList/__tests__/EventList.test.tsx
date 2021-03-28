import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import faker from 'faker'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'

it('should render list of events', async () => {
  const events = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeEvent,
  )

  signInToOrganization({events})

  const {findByText} = render(<App />)

  for (const event of events) {
    expect(await findByText(event.name)).toBeInTheDocument()
  }
})

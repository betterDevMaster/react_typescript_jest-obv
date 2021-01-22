import React from 'react'
import App from 'App'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import {ObvioEvent} from 'Event'
import {goToEvent} from 'organization/Event/__utils__/event'

afterEach(() => {
  jest.clearAllMocks()
})

export async function goToSpeakerConfig(overrides: {event?: ObvioEvent} = {}) {
  const data = goToEvent(overrides)
  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))
  user.click(await renderResult.findByLabelText('configure speakers'))

  return {...data, ...renderResult}
}

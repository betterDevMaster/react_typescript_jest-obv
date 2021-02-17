import {ObvioEvent} from 'Event'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import {goToEvent} from 'organization/Event/__utils__/event'

export async function goToGeneralConfig(options: {event?: ObvioEvent} = {}) {
  const data = goToEvent(options)
  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))
  user.click(await renderResult.findByLabelText('general config'))

  return {...data, ...renderResult}
}

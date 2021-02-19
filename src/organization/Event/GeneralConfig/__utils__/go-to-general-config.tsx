import {ObvioEvent} from 'Event'
import user from '@testing-library/user-event'
import {goToEventConfig} from 'organization/Event/__utils__/event'

export async function goToGeneralConfig(options: {event?: ObvioEvent} = {}) {
  const res = await goToEventConfig(options)

  user.click(await res.findByLabelText('general config'))

  return res
}

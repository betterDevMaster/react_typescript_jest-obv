import faker from 'faker'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {createPrivate} from 'lib/sockets/echo'
import {createChannel} from 'lib/sockets/__mocks__/echo'
import moment from 'moment'
import {act, findAllByText} from '@testing-library/react'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockCreateEcho = createPrivate as jest.Mock

it('should update number of credits', async () => {
  // Hijack socket chanel's listen to get a reference to the
  // handler. This will let us 'push' updates through
  // the socket manually.
  const channel = createChannel()

  let updateHandler: any = null
  channel.listen = (event: string, handler: (...args: any[]) => void) => {
    if (event === '.updated') {
      updateHandler = handler
    }

    return channel
  }

  mockCreateEcho.mockImplementation(() => channel)

  const startNumCredits = 300
  const updatedNumCredits = 1200

  const user = fakeTeamMember({
    credits: startNumCredits, // start with 0
  })

  const {findAllByLabelText} = await goToBillingSettings({
    authUser: user,
  })

  expect((await findAllByLabelText('credit balance'))[0].textContent).toBe(
    `${startNumCredits}`,
  )

  // Send updated credits
  act(() => {
    updateHandler({
      ...user,
      credits: updatedNumCredits,
    })
  })

  // Did update num credits shown
  expect((await findAllByLabelText('credit balance'))[0].textContent).toBe(
    `${updatedNumCredits}`,
  )
})

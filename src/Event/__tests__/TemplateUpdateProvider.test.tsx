import faker from 'faker'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {createPrivate} from 'lib/sockets/echo'
import {createChannel} from 'lib/sockets/__mocks__/echo'
import moment from 'moment'
import {act} from '@testing-library/react'

const mockCreateEcho = createPrivate as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should edit the selected button', async () => {
  // Hijack socket chanel's listen to get a reference to the
  // handler. This will let us 'push' updates through
  // the socket manually.
  const channel = createChannel()

  let templateUpdateHandler: any = null
  channel.listen = (event: string, handler: (...args: any[]) => void) => {
    if (event === '.template.updated') {
      templateUpdateHandler = handler
    }

    return channel
  }

  mockCreateEcho.mockImplementation(() => channel)

  // Create the button we'll be testing updates for

  const button = fakeNavButtonWithSize()
  const mainNav = createHashMap([button])

  const id = Object.keys(mainNav)[0] // only have 1 button

  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav,
    }),
  })
  const {findByText} = await goToDashboardConfig({event})

  const updatedValue = faker.random.word()

  act(() => {
    templateUpdateHandler({
      updated_at: moment().toISOString(),
      template: {
        [`mainNav.${id}.text`]: updatedValue,
      },
    })
  })

  // Did update button text
  expect(await findByText(updatedValue)).toBeInTheDocument()

  // Let's send another udpate with an OLDER timestamp, so it
  // should be ignored
  act(() => {
    templateUpdateHandler({
      updated_at: moment().subtract(1, 'minutes').toISOString(),
      template: {
        [`mainNav.${id}.text`]: 'DidNotChange',
      },
    })
  })

  // Still showing same button text
  expect(await findByText(updatedValue)).toBeInTheDocument()
})

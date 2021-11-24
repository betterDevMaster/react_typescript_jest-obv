import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToEventConfig} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update progress bar color', async () => {
  const event = fakeEvent()
  const {findByLabelText} = await goToEventConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('check in'))

  const color = '#e7e7e7'
  user.type(await findByLabelText('bar color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['progressBar.barColor']).toBe(color)
})

it('should hide config fields', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      progressBar: {
        ...fakeSimpleBlog().progressBar,
        showing: false, // hiding bar
      },
    }),
  })
  const {findByLabelText, queryByLabelText} = await goToEventConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('check in'))

  // Is hiding config fields since we've deactivated the bar
  expect(queryByLabelText('bar color')).not.toBeInTheDocument()
})

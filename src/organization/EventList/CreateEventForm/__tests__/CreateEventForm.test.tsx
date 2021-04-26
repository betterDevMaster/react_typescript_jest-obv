import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import React from 'react'
import faker from 'faker'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import {CREATE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/dom'
import axios from 'axios'
import {act} from 'react-dom/test-utils'
import moment from 'moment'
import {now, MINUTE_PRECISION_FORMAT} from 'lib/date-time'
import {fireEvent} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add an event', async () => {
  const events = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeEvent,
  )

  const {organization} = signInToOrganization({
    events,
    userPermissions: [CREATE_EVENTS],
  })

  const {findByLabelText, findByText} = render(<App />)

  const newEvent = fakeEvent()

  user.click(await findByLabelText('create event'))

  const name = faker.random.words(3)
  const slug = faker.random.word()
  const startDate = now()
  const endDate = moment().add(3, 'days').format(MINUTE_PRECISION_FORMAT)

  const count = 10

  await act(async () => {
    user.type(await findByLabelText('event name'), name)
    user.type(await findByLabelText('domain slug'), slug)

    fireEvent.change(await findByLabelText('start'), {
      target: {
        value: startDate,
      },
    })

    fireEvent.change(await findByLabelText('end'), {
      target: {
        value: endDate,
      },
    })

    user.type(await findByLabelText('expected number of attendees'), `${count}`)
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: newEvent}))
  const withNewEvent = [...events, newEvent]
  mockGet.mockImplementationOnce(() => Promise.resolve({data: withNewEvent}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/organizations/${organization.slug}/events`)
  expect(data.name).toBe(name)
  expect(data.slug).toBe(slug)
  expect(data.start).toMatch(startDate)

  expect(data.end).toMatch(endDate)
  expect(data.num_attendees).toBe(`${count}`)

  // Rendered in list
  expect(await findByText(newEvent.name)).toBeInTheDocument()
})

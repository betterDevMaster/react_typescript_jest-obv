import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import faker from 'faker'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render sponsors', async () => {
  const button = fakeNavButtonWithSize({
    page: '/sponsors',
    text: 'Sponsors',
  })

  const sponsors = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSponsor,
  )

  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: createEntityList([button]),
    }),
  })

  const {findAllByLabelText, findByText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: sponsors}))

  user.click(await findByText(/sponsors/i))

  // Showing all sponsors
  expect((await findAllByLabelText('sponsor')).length).toBe(sponsors.length)
})

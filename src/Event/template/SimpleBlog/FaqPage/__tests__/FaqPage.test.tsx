import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent, fakeFaq} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createHashMap} from 'lib/list'
import faker from 'faker'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render faqs', async () => {
  const button = fakeNavButtonWithSize({
    page: '/faq',
    text: 'faq',
  })

  const faqs = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeFaq,
  )

  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: createHashMap([button]),
    }),
  })

  const {findAllByLabelText, findByText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: faqs}))

  user.click(await findByText(/faq/i))

  // Showing all faqs
  expect((await findAllByLabelText('faq')).length).toBe(faqs.length)
})

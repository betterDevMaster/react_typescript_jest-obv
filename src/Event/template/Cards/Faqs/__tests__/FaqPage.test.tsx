import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent, fakeFaq} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createHashMap} from 'lib/list'
import faker from 'faker'
import axios from 'axios'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render faqs', async () => {
  const button = fakeCardsNavButton({
    page: '/faq',
    text: 'faq page',
  })

  const faqs = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeFaq,
  )

  const event = fakeEvent({
    template: fakeCards({
      mainNav: {buttons: createHashMap([button])},
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

  user.click(await findByText(/faq page/i))

  // Showing all faqs
  expect((await findAllByLabelText('faq')).length).toBe(faqs.length)
})

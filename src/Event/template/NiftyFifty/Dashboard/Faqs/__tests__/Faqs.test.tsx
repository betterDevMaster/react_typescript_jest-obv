import faker from 'faker'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import {fakeEvent, fakeFaq} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render faqs', async () => {
  const faqs = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeFaq,
  )
  const event = fakeEvent({
    template: fakeNiftyFifty(),
  })
  const {findAllByLabelText, findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
    beforeLogin: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: faqs}))
    },
  })
  user.click(await findByLabelText('panels tab faqs'))
  // Showing all faqs
  expect((await findAllByLabelText('faq')).length).toBe(faqs.length)
})

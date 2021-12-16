import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {fakeEvent, fakeFaq, fakeSponsor} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render sponsors', async () => {
  const faqs = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeFaq,
  )
  const sponsors = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSponsor,
  )

  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })

  const {findAllByLabelText, findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
    beforeLogin: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: faqs}))
      mockGet.mockImplementationOnce(() => Promise.resolve({data: sponsors}))
    },
  })

  user.click(await findByLabelText('panels tab sponsors'))

  // Showing all sponsors
  expect((await findAllByLabelText('sponsor')).length).toBe(sponsors.length)
})

import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import faker from 'faker'
import axios from 'axios'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render sponsors', async () => {
  const button = fakeCardsNavButton({
    page: '/sponsors',
    text: 'Sponsors Page',
  })

  const sponsors = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSponsor,
  )

  const event = fakeEvent({
    template: fakeCards({
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

  user.click(await findByText(/sponsors page/i))

  // Showing all sponsors
  expect((await findAllByLabelText('sponsor')).length).toBe(sponsors.length)
})

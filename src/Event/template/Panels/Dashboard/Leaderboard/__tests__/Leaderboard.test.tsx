import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent, fakeEntry} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render points tab', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })

  const {findAllByLabelText, findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  user.click(await findByLabelText('panels tab points'))

  const entries = Array.from(
    {length: faker.random.number({min: 1, max: 10})},
    fakeEntry,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: entries}))

  expect((await findAllByLabelText('entry')).length).toBe(entries.length)
})

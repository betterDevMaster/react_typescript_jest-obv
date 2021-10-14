import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import mockAxios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockPost = mockAxios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should receive points', async () => {
  const action = fakeAction()
  const button = fakeCardsNavButton({
    actionId: action.key,

    /**
     * Will still receive points even for area buttons
     */

    areaId: faker.random.alphaNumeric(16),
    isAreaButton: true,
  })

  const buttons = createEntityList([button])
  const event = fakeEvent({template: fakeCards({mainNav: buttons})})

  const {findByText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      waiver: 'waiver.png',
      tech_check_completed_at: 'now',
    }),
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'got points'}))

  user.click(await findByText(button.text))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`)

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})

it('should add an infusionsoft tag', async () => {
  const action = fakeAction()

  const id = faker.random.number({min: 1000, max: 10000})
  const button = fakeCardsNavButton({
    infusionsoftTag: {id, name: 'Some tag'},
  })

  const buttons = createEntityList([button])
  const event = fakeEvent({template: fakeCards({mainNav: buttons})})

  const {findByText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      waiver: 'waiver.png',
      tech_check_completed_at: 'now',
    }),
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByText(button.text))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url, data] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/integrations/infusionsoft/add_tag`)
  expect(data.id).toBe(id)
})

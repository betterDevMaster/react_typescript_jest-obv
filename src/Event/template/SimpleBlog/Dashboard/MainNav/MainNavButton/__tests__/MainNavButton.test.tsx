import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import mockAxios from 'axios'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})
it('should join a room', async () => {
  const windowOpen = (global.open = jest.fn())
  const id = faker.random.number({min: 1, max: 1000})
  const button = fakeNavButtonWithSize({isAreaButton: true, areaId: id})
  const mainNav = createEntityList([button])

  const event = fakeEvent({template: fakeSimpleBlog({mainNav})})

  const {findByText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
  )

  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))

  user.click(await findByText(button.text))

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(windowOpen).toHaveBeenCalledTimes(1)
  })

  const [joinUrl] = mockGet.mock.calls[0]
  expect(joinUrl).toMatch(`events/${event.slug}/areas/${id}`)

  const [openUrl] = windowOpen.mock.calls[0]
  expect(openUrl).toBe(url)
})

it('should receive points', async () => {
  const action = fakeAction()
  const button = fakeNavButtonWithSize({actionId: action.key})

  const mainNav = createEntityList([button])
  const event = fakeEvent({template: fakeSimpleBlog({mainNav})})

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
  const button = fakeNavButtonWithSize({
    infusionsoftTag: {id, name: 'Some tag'},
  })

  const mainNav = createEntityList([button])
  const event = fakeEvent({template: fakeSimpleBlog({mainNav})})

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

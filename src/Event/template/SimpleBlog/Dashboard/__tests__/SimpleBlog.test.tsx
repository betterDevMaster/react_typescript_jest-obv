import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import userEvent from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockAxiosPost = axios.post as jest.Mock
const mockRxPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should update the logo', async () => {
  const dashboard = fakeSimpleBlog()
  const event = fakeEvent({template: dashboard})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {event, withRouter: true, score: defaultScore, actions: emptyActions},
  )

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    dashboard.logo,
  )

  clickEdit(await findByLabelText('header'))

  const newUrl = faker.internet.url()
  userEvent.type(await findByLabelText('edit logo'), newUrl)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    `${newUrl}/`,
  )

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.logo).toBe(newUrl)
})

it('should show the user email', async () => {
  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
  })

  const {findByText, findByLabelText} = await loginToEventSite({
    attendee,
  })

  user.click(await findByLabelText('show side menu'))
  expect(await findByText(new RegExp(attendee.email))).toBeInTheDocument()
})

it('it should send points for visiting dashboard', async () => {
  const action = fakeAction({
    id: 3, // Dashboard has id of 3
    is_platform_action: true,
    description: 'dashboard action',
  })

  const platformActions = [action]

  mockAxiosPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  const {event, findByText} = await loginToEventSite({
    platformActions,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  await wait(() => {
    expect(mockAxiosPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockAxiosPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/3`) // Fired dashboard ID

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})

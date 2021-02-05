import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakePoints} from 'Event/Dashboard/components/PointsSummary/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {ObvioEvent} from 'Event'
import axios from 'axios'

const mockRxPost = mockRxJsAjax.post as jest.Mock
const mockAxiosPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render points', async () => {
  const withoutPoints = fakeEvent({template: fakeSimpleBlog({points: null})})

  const {queryByText, rerender, findByText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: withoutPoints,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints()

  const withPoints = fakeEvent({
    template: fakeSimpleBlog({
      points,
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, {
    event: withPoints,
  })

  const pointsText = new RegExp(`${points.unit}!`, 'i')

  expect(await findByText(pointsText)).toBeInTheDocument()
})

it('should configure points', async () => {
  const event = fakeEvent({template: fakeSimpleBlog({points: null})})
  const {queryByText, findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('set points'))

  const unit = faker.random.word()
  user.type(await findByLabelText('points unit'), unit)

  fireEvent.click(await findByLabelText('close config dialog'))

  const pointsText = new RegExp(`you've earned 0 ${unit}!`, 'i')

  expect(await findByText(pointsText)).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.points).not.toBeNull()
})

it('should remove points', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      points: fakePoints(),
    }),
  })

  const {queryByText, findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  expect(await findByText(/you've earned 0 .*/i)).toBeInTheDocument()

  clickEdit(await findByLabelText('points summary'))

  fireEvent.click(await findByLabelText('remove points'))

  await wait(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.points).toBeNull()
})

it('should upload a logo', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      points: fakePoints(),
    }),
  })

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('points summary'))

  const logo = new File([], 'mylogo.jpg')
  const logoInput = await findByLabelText('points_summary_logo image input')
  Object.defineProperty(logoInput, 'files', {
    value: [logo],
  })

  const logoData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withLogo: ObvioEvent = {...event, points_summary_logo: logoData}

  mockAxiosPost.mockImplementationOnce(() => Promise.resolve(withLogo))

  fireEvent.change(logoInput)

  await wait(() => {
    expect(mockAxiosPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockAxiosPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('points_summary_logo')).toBe(logo)
})

it('should remove the logo', async () => {
  const logo = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const event = fakeEvent({
    template: fakeSimpleBlog({
      points: fakePoints(),
    }),
    points_summary_logo: logo,
  })

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('points summary'))

  const withoutLogo: ObvioEvent = {...event, points_summary_logo: null}
  mockPut.mockImplementationOnce(() => Promise.resolve(withoutLogo))

  user.click(await findByLabelText('remove points_summary_logo image'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.points_summary_logo).toBe(null)
})

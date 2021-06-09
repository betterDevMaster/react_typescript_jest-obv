import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeResource} from 'Event/template/Panels/Dashboard/ResourceList/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import axios from 'axios'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render resources', async () => {
  const event = fakeEvent({
    template: fakePanels({
      resourceList: {
        title: faker.random.word(),
        resources: [],
      },
    }),
  })

  const {rerender, findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {event, withRouter: true, score: defaultScore, actions: emptyActions},
  )

  const numResources = faker.random.number({min: 1, max: 6})
  const withResourcesTemplate = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: Array.from({length: numResources}, () =>
        fakeResource({isVisible: true}),
      ),
    },
  })
  const withResources = fakeEvent({
    template: withResourcesTemplate,
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, {
    event: withResources,
  })

  user.click(await findByLabelText('panels tab resources'))

  const resources = await findAllByLabelText('event resource')
  const numVisible = withResourcesTemplate.resourceList.resources.filter(
    (r) => r.isVisible,
  ).length

  expect(resources.length).toBe(numVisible)
})

it('should add a new resource', async () => {
  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {findByLabelText, findAllByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
    },
  )

  user.click(await findByLabelText('panels tab resources'))

  fireEvent.click(await findByLabelText('add resource'))
  expect((await findAllByLabelText('event resource')).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources.length).toBe(1)
})

it('should update resources title', async () => {
  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
    },
  )

  user.click(await findByLabelText('panels tab resources'))

  clickEdit(await findByLabelText('resources'))

  const updatedTitle = faker.random.words(2)
  user.type(await findByLabelText('update resources title'), updatedTitle)

  expect((await findByLabelText('resources')).textContent).toBe(updatedTitle)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.title).toBe(updatedTitle)
})

it('should update a resource', async () => {
  const name = faker.random.word()

  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: [fakeResource({name})],
    },
  })

  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const downloadLinkText = 'Download'

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
    },
  )

  user.click(await findByLabelText('panels tab resources'))

  expect((await findByLabelText('resource link')).textContent).toBe(
    downloadLinkText,
  )

  clickEdit(await findByLabelText('event resource'))

  const updatedName = faker.random.word()
  user.type(await findByLabelText('resource name'), updatedName)

  expect((await findByLabelText('resource link')).textContent).toBe(
    downloadLinkText,
  )

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources[0].name).toBe(updatedName)
})

it('should remove a resource', async () => {
  const resources = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeResource,
  )

  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources,
    },
  })
  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {findAllByLabelText, findByLabelText, queryByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
    },
  )

  user.click(await findByLabelText('panels tab resources'))

  expect((await findAllByLabelText('event resource')).length).toBe(
    resources.length,
  )

  const targetIndex = faker.random.number({min: 0, max: resources.length - 1})
  const target = resources[targetIndex]
  const targetName = resources[targetIndex].name

  clickEdit((await findAllByLabelText('event resource'))[targetIndex])

  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: 'delete success'}),
  )

  fireEvent.click(await findByLabelText('remove resource'))

  expect((await findAllByLabelText('event resource')).length).toBe(
    resources.length - 1,
  )

  expect(queryByText(targetName)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources.length).toBe(resources.length - 1)

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/resources/${target.filePath}`,
  )
})

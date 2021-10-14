import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeResource} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createResourceList} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.warn.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should add a resource list', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {
    findByLabelText,
    findByText,
    findAllByText,
  } = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/resources/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByText(/resource/i)).length).toBeGreaterThan(0)

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].type).toBe('Resource List')
})

it('should remove a resource list', async () => {
  const event = fakeEvent({
    template: fakeCards({
      sidebarItems: [createResourceList()],
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove resources/i))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/resource resources/i)).not.toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems.length).toBe(0)
})

it('should add a new resource', async () => {
  const dashboard = fakeCards({
    sidebarItems: [
      {
        ...createResourceList(),
        title: faker.random.word(),
        description: '',
        resources: [],
      },
    ],
  })

  const event = fakeEvent({template: dashboard})

  const {
    queryByLabelText,
    findByLabelText,
    findAllByLabelText,
  } = await goToDashboardConfig({event})

  expect(queryByLabelText('event resource')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add resource'))
  fireEvent.click(await findByLabelText('save'))
  expect((await findAllByLabelText('event resource')).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].resources.length).toBe(1)
})

it('should update resources description', async () => {
  const description = faker.random.words(5)

  const dashboard = fakeCards({
    sidebarItems: [
      {
        ...createResourceList(),
        title: faker.random.word(),
        description,
        resources: [],
      },
    ],
  })

  const event = fakeEvent({template: dashboard})
  const {findByLabelText} = await goToDashboardConfig({event})

  expect((await findByLabelText('resource description')).textContent).toBe(
    description,
  )

  clickEdit(await findByLabelText('resources'))

  const updatedDescription = faker.random.words(5)
  const updatedTitle = faker.random.words(2)
  user.type(
    await findByLabelText('update resources description'),
    updatedDescription,
  )

  user.type(await findByLabelText('update resources title'), updatedTitle)

  fireEvent.click(await findByLabelText('save'))

  await wait(async () => {
    expect((await findByLabelText('resource description')).textContent).toBe(
      updatedDescription,
    )
  })

  expect((await findByLabelText('resources')).textContent).toBe(updatedTitle)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].description).toBe(updatedDescription)
  expect(data.template.sidebarItems[0].title).toBe(updatedTitle)
})

it('should update a resource', async () => {
  const name = faker.random.word()

  const dashboard = fakeCards({
    sidebarItems: [
      {
        ...createResourceList(),
        title: faker.random.word(),
        description: '',
        resources: [fakeResource({name})],
      },
    ],
  })

  const event = fakeEvent({template: dashboard})

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  expect((await findByLabelText('resource link')).textContent).toBe(name)

  clickEdit(await findByLabelText('event resource'))

  const updatedName = faker.random.word()
  user.type(await findByLabelText('resource name'), updatedName)

  fireEvent.click(await findByLabelText('save'))

  await wait(async () => {
    expect(await findByText(updatedName)).toBeInTheDocument()
  })

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].resources[0].name).toBe(updatedName)
})

it('should remove a resource', async () => {
  const resources = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeResource,
  )

  const dashboard = fakeCards({
    sidebarItems: [
      {
        ...createResourceList(),
        title: faker.random.word(),
        description: '',
        resources,
      },
    ],
  })
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({event})

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
  expect(data.template.sidebarItems[0].resources.length).toBe(
    resources.length - 1,
  )

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/resources/${target.filePath}`,
  )
})

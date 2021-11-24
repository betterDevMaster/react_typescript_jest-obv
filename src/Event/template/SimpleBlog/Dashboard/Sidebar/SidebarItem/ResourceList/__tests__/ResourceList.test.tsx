import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeResource} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createResourceList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {createEntityList} from 'lib/list'

const mockPut = axios.put as jest.Mock
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
    template: fakeSimpleBlog(),
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByText(/resource/i)).length).toBeGreaterThan(0)

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = data.template['sidebarItems.ids'][0]
  expect(data.template[`sidebarItems.entities.${id}.type`]).toBe(
    'Resource List',
  )
})

it('should remove a resource list', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: createEntityList([createResourceList()]),
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove resources/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/resource resources/i)).not.toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['sidebarItems.ids'].length).toBe(0)
})

it('should add a new resource', async () => {
  const sidebarItems = createEntityList([
    {
      ...createResourceList(),
      title: faker.random.word(),
      description: '',
      resources: createEntityList([]),
    },
  ])
  const dashboard = fakeSimpleBlog({
    sidebarItems,
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = sidebarItems.ids[0]
  expect(
    data.template[`sidebarItems.entities.${id}.resources.ids`].length,
  ).toBe(1)
})

it('should update resources description', async () => {
  const description = faker.random.words(5)
  const sidebarItems = createEntityList([
    {
      ...createResourceList(),
      title: faker.random.word(),
      description,
      resources: createEntityList([]),
    },
  ])

  const dashboard = fakeSimpleBlog({
    sidebarItems,
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = sidebarItems.ids[0]

  expect(data.template[`sidebarItems.entities.${id}.description`]).toBe(
    updatedDescription,
  )
  expect(data.template[`sidebarItems.entities.${id}.title`]).toBe(updatedTitle)
})

it('should update a resource', async () => {
  const name = faker.random.word()

  const resources = createEntityList([fakeResource({name})])
  const sidebarItems = createEntityList([
    {
      ...createResourceList(),
      title: faker.random.word(),
      description: '',
      resources,
    },
  ])

  const dashboard = fakeSimpleBlog({
    sidebarItems,
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const itemId = sidebarItems.ids[0]
  const resourceId = resources.ids[0]

  expect(
    data.template[
      `sidebarItems.entities.${itemId}.resources.entities.${resourceId}.name`
    ],
  ).toBe(updatedName)
})

it('should remove a resource', async () => {
  const numResources = faker.random.number({min: 2, max: 5})

  const resources = createEntityList(
    Array.from({length: numResources}, fakeResource),
  )

  const sidebarItems = createEntityList([
    {
      ...createResourceList(),
      title: faker.random.word(),
      description: '',
      resources,
    },
  ])

  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({event})

  expect((await findAllByLabelText('event resource')).length).toBe(
    resources.ids.length,
  )

  const targetIndex = faker.random.number({
    min: 0,
    max: resources.ids.length - 1,
  })
  const targetId = resources.ids[targetIndex]
  const target = resources.entities[targetId]
  const targetName = target.name

  clickEdit((await findAllByLabelText('event resource'))[targetIndex])

  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: 'delete success'}),
  )

  fireEvent.click(await findByLabelText('remove resource'))

  expect((await findAllByLabelText('event resource')).length).toBe(
    numResources - 1,
  )

  expect(queryByText(targetName)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const itemId = sidebarItems.ids[0]
  expect(
    data.template[`sidebarItems.entities.${itemId}.resources.ids`].length,
  ).toBe(numResources - 1)

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/resources/${target.filePath}`,
  )
})

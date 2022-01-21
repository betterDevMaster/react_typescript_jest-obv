import user from '@testing-library/user-event'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeResource} from 'Event/template/Panels/Dashboard/Resources/ResourceList/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import axios from 'axios'
import {goToPanelsConfig} from 'Event/template/Panels/__utils__/go-to-panels-config'

// const mockPost = mockRxJsAjax.post as jest.Mock
const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a new resource', async () => {
  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})

  const {findByLabelText, findAllByLabelText} = await goToPanelsConfig({
    event,
  })

  user.click(await findByLabelText('panels tab resources'))

  fireEvent.click(await findByLabelText('add resource'))
  fireEvent.click(await findByLabelText('save'))

  expect((await findAllByLabelText('event resource')).length).toBe(1)
  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['resourceList.resources'].length).toBe(1)
})

it('should update resources title', async () => {
  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})

  const {findByLabelText} = await goToPanelsConfig({
    event,
  })

  user.click(await findByLabelText('panels tab resources'))

  clickEdit(await findByLabelText('resources'))

  const updatedTitle = faker.random.words(2)
  user.type(await findByLabelText('update resources title'), updatedTitle)
  fireEvent.click(await findByLabelText('save'))

  expect((await findByLabelText('resources')).textContent).toBe(updatedTitle)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['resourceList.title']).toBe(updatedTitle)
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

  const downloadLinkText = 'Download'

  const {findByLabelText} = await goToPanelsConfig({
    event,
  })

  user.click(await findByLabelText('panels tab resources'))

  expect((await findByLabelText('resource link')).textContent).toBe(
    downloadLinkText,
  )

  clickEdit(await findByLabelText('event resource'))

  const updatedName = faker.random.word()
  user.type(await findByLabelText('resource name'), updatedName)
  fireEvent.click(await findByLabelText('save'))

  expect((await findByLabelText('resource link')).textContent).toBe(
    downloadLinkText,
  )

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['resourceList.resources'][0].name).toBe(updatedName)
})

it('should remove a resource', async () => {
  const resources = new Array(faker.random.number({min: 2, max: 5}))
    .fill(null)
    .map((_, index) => fakeResource({name: `${index}_resource`}))

  const dashboard = fakePanels({
    resourceList: {
      title: faker.random.word(),
      resources,
    },
  })
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToPanelsConfig({
    event,
  })

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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['resourceList.resources'].length).toBe(
    resources.length - 1,
  )

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/resources/${target.filePath}`,
  )
})

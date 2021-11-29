import {fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {fakeResource} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createResourceList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {createHashMap} from 'lib/list'

const mockAjaxPost = axios.post as jest.Mock
const mockAjaxDelete = axios.delete as jest.Mock
const mockPut = axios.put as jest.Mock

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.warn.mockRestore()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should upload a file', async () => {
  const resources = createHashMap([fakeResource({filePath: ''})])
  const sidebarItems = createHashMap([
    {
      ...createResourceList(),
      resources,
    },
  ])
  const template = fakeSimpleBlog({
    sidebarItems,
  })

  const event = fakeEvent({
    template,
  })

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('event resource'))

  const file = new File([], 'myfile.pdf')
  const uploadDiv = await findByLabelText('resource upload')
  const filePath = 'somegeneratedfilepath.pdf'

  // Server responds with file path
  mockAjaxPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file: filePath,
      },
    }),
  )

  fireEvent.drop(uploadDiv, {
    dataTransfer: {
      files: [file],
    },
  })

  // Uploaded?
  await wait(() => {
    expect(mockAjaxPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockAjaxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/resources`) // was posted to resources

  // Shows remove button, ie. has existing file now
  expect(await findByLabelText('remove resource file')).toBeInTheDocument()

  user.click(await findByLabelText('save'))

  // saved?
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [saveUrl, savedData] = mockPut.mock.calls[0]
  expect(saveUrl).toMatch(`/events/${event.slug}/template`)

  // Saved returned file path
  const sidebarId = Object.keys(sidebarItems)[0]
  const resourceId = Object.keys(resources)[0]
  expect(
    savedData.template[
      `sidebarItems.${sidebarId}.resources.${resourceId}.filePath`
    ],
  ).toBe(filePath)
})

it('should delete an existing file', async () => {
  const existingFile = 'myexistingfile.pdf'
  const withExistingFile = fakeResource({filePath: existingFile})

  const template = fakeSimpleBlog({
    sidebarItems: createHashMap([
      {
        ...createResourceList(),
        resources: createHashMap([withExistingFile]),
      },
    ]),
  })

  const event = fakeEvent({
    template,
  })

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('event resource'))

  const file = new File([], 'myfile.pdf')
  const uploadEl = await findByLabelText('resource upload')
  const filePath = 'somegeneratedfilepath.pdf'

  // Deletes existing file
  mockAjaxDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  // Server responds with file path
  mockAjaxPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file: filePath,
      },
    }),
  )

  fireEvent.drop(uploadEl, {
    dataTransfer: {
      files: [file],
    },
  })

  await wait(() => {
    expect(mockAjaxDelete).toHaveBeenCalledTimes(1)
  })

  const [deleteUrl] = mockAjaxDelete.mock.calls[0]

  expect(deleteUrl).toMatch(`/resources/${existingFile}`)

  // Uploaded?
  await wait(() => {
    expect(mockAjaxPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockAjaxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/resources`) // was posted to resources
})

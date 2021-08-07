import {fireEvent, wait} from '@testing-library/react'
import {fakeResource} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createResourceList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'

const mockAjaxPost = axios.post as jest.Mock
const mockAjaxDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should remove the existing file', async () => {
  const existingFile = 'myexistingfile.pdf'
  const withExistingFile = fakeResource({filePath: existingFile})

  const template = fakeSimpleBlog({
    sidebarItems: [
      {
        ...createResourceList(),
        resources: [withExistingFile],
      },
    ],
  })

  const event = fakeEvent({
    template,
  })

  const {findByLabelText, queryByLabelText} = await goToDashboardConfig({
    event,
  })
  clickEdit(await findByLabelText('event resource'))
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

  const removeButton = await findByLabelText('remove resource file')

  fireEvent.click(removeButton)

  await wait(() => {
    expect(mockAjaxDelete).toHaveBeenCalledTimes(1)
  })

  const [deleteUrl] = mockAjaxDelete.mock.calls[0]

  expect(deleteUrl).toMatch(`/resources/${existingFile}`)

  await wait(() => {
    expect(queryByLabelText('remove resource file')).not.toBeInTheDocument()
  })
})

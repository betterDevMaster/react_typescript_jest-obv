import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {fakeResource} from 'Event/template/SimpleBlog/Dashboard/ResourceList/__utils__/factory'
import axios from 'axios'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('should add a resource group', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      resourceGroupList: {
        groups: [],
      },
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  user.click(await findByText(/add resource group/i))

  const title = 'PDFs and stuff'
  user.type(await findByLabelText('update resource group title'), title)

  user.click(await findByText(/save/i))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceGroupList.groups[0].title).toBe(title)

  clickEdit(await findByText(title))

  const newTitle = 'Links, and useful things'
  user.type(await findByLabelText('update resource group title'), newTitle)

  user.click(await findByText(/save/i))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  expect(await findByText(newTitle)).toBeInTheDocument()
})

it('should remove a resource group', async () => {
  const title = 'PDFs'
  const resource = fakeResource()
  const event = fakeEvent({
    template: fakeSimpleBlog({
      resourceGroupList: {
        groups: [
          {
            isVisible: true,
            title,
            description: '',
            resources: [resource],
          },
        ],
      },
    }),
  })

  const {queryByText, findByText} = await goToDashboardConfig({event})

  clickEdit(await findByText(title))

  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: 'delete success'}),
  )

  user.click(await findByText(/remove group/i))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceGroupList.groups.length).toBe(0)

  expect(queryByText(title)).not.toBeInTheDocument()

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/resources/${resource.filePath}`,
  )
})

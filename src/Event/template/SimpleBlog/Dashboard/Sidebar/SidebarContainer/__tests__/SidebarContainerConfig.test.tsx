import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render sidebar config', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarNav: createEntityList([]),
    }),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByLabelText('edit sidebar'))

  const color = '000000'
  user.type(await findByLabelText('background color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebar.background).toBe(color)
})

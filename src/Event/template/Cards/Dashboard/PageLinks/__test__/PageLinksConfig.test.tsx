import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should config card panel', async () => {
  const event = fakeEvent({template: fakeCards(), logo: null})

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('edit page links'))

  const color = '#555555'
  user.type(await findByLabelText('divider color'), color)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.pageLinks.dividerColor).toBe(color)
})

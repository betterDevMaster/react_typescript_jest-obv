import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render sidebar config', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByLabelText('edit sidebar'))

  const color = '000000'
  user.type(await findByLabelText('background color'), color)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['sidebar.background']).toBe(color)
})

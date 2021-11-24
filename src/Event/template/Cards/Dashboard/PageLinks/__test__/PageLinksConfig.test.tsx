import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template['pageLinks.dividerColor']).toBe(color)
})

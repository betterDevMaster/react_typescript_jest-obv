import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {wait} from '@testing-library/react'
import faker from 'faker'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should edit post styles', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('style posts'))

  const color = faker.internet.color()
  user.type(await findByLabelText('date text color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPut.mock.calls[0]

  expect(data.template['postStyles.dateTextColor']).toBe(color)
})

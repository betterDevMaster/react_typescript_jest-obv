import {testTemplates} from 'Event/template/__utils__/tester'
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

testTemplates('should edit post form styles', async (fakeTemplate) => {
  const event = fakeEvent({
    template: fakeTemplate(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('style post form'))

  const color = faker.internet.color()
  user.type(await findByLabelText('submit button color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPut.mock.calls[0]

  expect(data.template['postFormStyles.buttonColor']).toBe(color)
})

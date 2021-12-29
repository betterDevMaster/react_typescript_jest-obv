import user from '@testing-library/user-event'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import faker from 'faker'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {clickEdit} from '__utils__/edit'
import {wait} from '@testing-library/react'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should update welcome Text', async () => {
  const event = fakeEvent({template: fakeNiftyFifty(), header_background: null})
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('welcome'))

  const welcomeText = faker.random.words(2)

  user.type(await findByLabelText('welcome text'), welcomeText)

  user.click(await findByLabelText('save welcome text'))

  expect((await findByLabelText('welcome')).textContent).toBe(welcomeText)

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.welcomeText).toBe(welcomeText)
})

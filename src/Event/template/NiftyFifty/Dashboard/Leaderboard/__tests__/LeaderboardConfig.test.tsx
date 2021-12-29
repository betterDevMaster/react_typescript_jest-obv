import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/dom'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {clickEdit} from '__utils__/edit'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update points tab page config', async () => {
  const {findByLabelText, event} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakeNiftyFifty(),
    }),
  })

  user.click(await findByLabelText('panels tab points'))

  clickEdit(await findByLabelText('config points tab page config'))

  const title = 'new points'

  fireEvent.change(await findByLabelText('set leaderboard page title'), {
    target: {
      value: title,
    },
  })

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['leaderboard.title']).toBe(title) // did save config data
})

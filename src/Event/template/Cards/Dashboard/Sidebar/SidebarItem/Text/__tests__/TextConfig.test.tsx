import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createText} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/Text'
import {createHashMap} from 'lib/list'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {fakeText} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/Text/__utils__/factory'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should configure a text item', async () => {
  const body = 'original text body'
  const sidebarItems = createHashMap([
    fakeText({
      body: body,
    }),
  ])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByLabelText('edit text'))
  fireEvent.click(await findByText(/save/i))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  const values = Object.values(data.template)

  // Saves config. Can't actually test updating the config since
  // currently it only contains a CKEditor, and MuiSlider
  // both of which are not easily testable.
  expect(values).toContain(body)
})

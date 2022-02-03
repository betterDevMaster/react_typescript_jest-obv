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

it('should add a text item', async () => {
  const event = fakeEvent({template: fakeCards()})
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))

  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/text/i))
  fireEvent.click(await findByLabelText('add item'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  const values = Object.values(data.template)

  // Has default value for a text component
  expect(values).toContain(
    'This is sample text.  Click Edit Text to modify this text.',
  )
})

it('should remove a text item', async () => {
  const body = 'some custom text'
  const sidebarItems = createHashMap([
    fakeText({
      body,
    }),
  ])
  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByText, queryByText} = await goToDashboardConfig({
    event,
  })

  expect(await findByText(new RegExp(body))).toBeInTheDocument()

  fireEvent.click(await findByText(/remove text/i))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${id}`]).toBe(REMOVE)

  // Did remove component
  expect(queryByText(new RegExp(body))).not.toBeInTheDocument()
})

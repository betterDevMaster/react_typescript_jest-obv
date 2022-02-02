import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {
  BLACK_RIBBON,
  RIBBONS,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeTicketRibbon} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createTicketRibbonList} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import axios from 'axios'
import {createHashMap, orderedIdsByPosition} from 'lib/list'
import {REMOVE} from 'Event/TemplateUpdateProvider'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a ticket ribbon list', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/ticket ribbons/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/remove ribbons/i)).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const values = Object.values(data.template)
  expect(values).toContain('Ticket Ribbon List')
})

it('should remove a ticket ribbon list', async () => {
  const sidebarItems = createHashMap([createTicketRibbonList()])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove ribbons/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove ribbons/i)).not.toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${id}`]).toBe(REMOVE)
})

it('should edit an existing ticket ribbon', async () => {
  const ticketRibbons = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeTicketRibbon,
  )
  const ribbons = createHashMap(ticketRibbons)

  const sidebarItems = createHashMap([
    {
      ...createTicketRibbonList(),
      ribbons,
    },
  ])
  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: ticketRibbons.length - 1,
  })

  // Renders same values as data
  expect(
    (await findAllByLabelText('ticket ribbon text'))[targetIndex].textContent,
  ).toBe(ticketRibbons[targetIndex].text)

  clickEdit((await findAllByLabelText('ticket ribbon'))[targetIndex])

  const ribbon = faker.random.arrayElement(RIBBONS)

  fireEvent.change(
    inputElementFor(await findByLabelText('pick ticket ribbon')),
    {
      target: {
        value: ribbon,
      },
    },
  )

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]
  const ribbonId = Object.keys(ribbons)[targetIndex]

  expect(
    data.template[`sidebarItems.${sidebarId}.ribbons.${ribbonId}.name`],
  ).toBe(ribbon)
})

it('should add a new ticket ribbon', async () => {
  const sidebarItems = createHashMap([
    {
      ...createTicketRibbonList(),
      ribbons: createHashMap([]),
    },
  ])
  const withoutRibbons = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({
    event: withoutRibbons,
  })

  fireEvent.click(await findByLabelText('add ticket ribbon'))

  fireEvent.change(
    inputElementFor(await findByLabelText('pick ticket ribbon')),
    {
      target: {
        value: BLACK_RIBBON,
      },
    },
  )

  const text = 'vip'

  user.type(await findByLabelText('ticket ribbon text input'), text)

  fireEvent.click(await findByLabelText('save'))

  expect(await findByLabelText('ticket ribbon')).toBeInTheDocument()
  expect(await findByText(new RegExp(text))).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${withoutRibbons.slug}/template`)

  const values = Object.values(data.template)
  expect(values).toContain(text)
})

it('should remove a ticket ribbon', async () => {
  const numRibbons = faker.random.number({min: 2, max: 5})

  const ticketRibbons = new Array(numRibbons)
    .fill(null)
    .map((_, index) => fakeTicketRibbon({text: `ribbon_${index}`}))

  const ribbons = createHashMap(ticketRibbons)

  const sidebarItems = createHashMap([
    {
      ...createTicketRibbonList(),
      ribbons,
    },
  ])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {
    findByLabelText,
    findAllByLabelText,
    queryByText,
  } = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: ticketRibbons.length - 1,
  })

  // Renders same values as data
  expect(
    (await findAllByLabelText('ticket ribbon text'))[targetIndex].textContent,
  ).toBe(ticketRibbons[targetIndex].text)

  clickEdit((await findAllByLabelText('ticket ribbon'))[targetIndex])

  fireEvent.click(await findByLabelText('remove ticket ribbon'))

  // Target ribbon removed
  expect(queryByText(ticketRibbons[targetIndex].text)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]
  const ribbonIds = orderedIdsByPosition(ribbons)
  const ribbonId = ribbonIds[targetIndex]

  expect(data.template[`sidebarItems.${sidebarId}.ribbons.${ribbonId}`]).toBe(
    REMOVE,
  )
})

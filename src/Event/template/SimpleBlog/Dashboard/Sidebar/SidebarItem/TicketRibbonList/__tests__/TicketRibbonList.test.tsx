import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {
  BLACK_RIBBON,
  RIBBONS,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeTicketRibbon} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/__utils__/factory'
import user from '@testing-library/user-event'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createTicketRibbonList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a ticket ribbon list', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/tickets/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/remove tickets/i)).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].type).toBe('Ticket Ribbon List')
})

it('should remove a ticket ribbon list', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [createTicketRibbonList()],
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove tickets/i))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove tickets/i)).not.toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems.length).toBe(0)
})

it('should edit an existing ticket ribbon', async () => {
  const ticketRibbons = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeTicketRibbon,
  )

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createTicketRibbonList(),
          ribbons: ticketRibbons,
        },
      ],
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
  await wait(
    () => {
      expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
    },
    {timeout: 30000},
  )

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].ribbons[targetIndex].name).toBe(ribbon)
})

it('should add a new ticket ribbon', async () => {
  const withoutRibbons = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createTicketRibbonList(),
          ribbons: [],
        },
      ],
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
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${withoutRibbons.slug}`)
  expect(data.template.sidebarItems[0].ribbons[0].text).toBe(text)
})

it('should remove a ticket ribbon', async () => {
  const ticketRibbons = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeTicketRibbon,
  )

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createTicketRibbonList(),
          ribbons: ticketRibbons,
        },
      ],
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
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  // one less ribbon saved
  expect(data.template.sidebarItems[0].ribbons.length).toBe(
    ticketRibbons.length - 1,
  )
})

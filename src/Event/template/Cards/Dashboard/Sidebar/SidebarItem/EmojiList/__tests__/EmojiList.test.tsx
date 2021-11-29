import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {DEFAULT_EMOJIS, EMOJI} from 'Event/Dashboard/components/EmojiList/emoji'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createEmojiList} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/EmojiList'
import axios from 'axios'
import {createHashMap} from 'lib/list'
import {REMOVE} from 'Event/TemplateUpdateProvider'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add an emoji list', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/emojis/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/remove emojis/i)).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  const values = Object.values(data.template)
  expect(values.includes('Emoji List')).toBe(true)
})

it('should remove an emoji list', async () => {
  const sidebarItems = createHashMap([createEmojiList()])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove emojis/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove emojis/i)).not.toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${id}`]).toBe(REMOVE)
})

it('should pick an emoji', async () => {
  const sidebarItems = createHashMap([createEmojiList()])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByLabelText('add emoji list'))

  expect((await findAllByLabelText('pick emoji')).length).toBe(1)

  const emoji = EMOJI.THUNDER.name
  fireEvent.change(inputElementFor(await findByLabelText('pick emoji')), {
    target: {
      value: emoji,
    },
  })

  // Shows another select to add another emoji
  expect((await findAllByLabelText('pick emoji')).length).toBe(2)

  user.click(await findByLabelText('save'))

  const emojis = await findAllByLabelText('event emoji')
  expect(emojis.length).toBe(1)

  expect(emojis[0].getAttribute('alt')).toBe(emoji)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  const sidebarId = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${sidebarId}.emojis`].length).toBe(1)
})

it('should remove an existing emoji', async () => {
  const numEmojis = faker.random.number({min: 2, max: 5})

  const emojis = Array.from(
    {length: numEmojis},
    () => faker.random.arrayElement(DEFAULT_EMOJIS).name,
  )

  const sidebarItems = createHashMap([
    {
      ...createEmojiList(),
      emojis,
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

  clickEdit(await findByLabelText('emoji list'))

  fireEvent.click((await findAllByLabelText('remove emoji'))[0])

  user.click(await findByLabelText('save'))

  expect((await findAllByLabelText('event emoji')).length).toBe(
    emojis.length - 1,
  )

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${sidebarId}.emojis`].length).toBe(
    numEmojis - 1,
  )
})

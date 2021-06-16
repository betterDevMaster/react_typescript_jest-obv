import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {DEFAULT_EMOJIS, EMOJI} from 'Event/Dashboard/components/emoji'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should pick an emoji', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      emojiList: {
        emojis: [],
      },
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

  fireEvent.click(await findByLabelText('close config dialog'))

  const emojis = await findAllByLabelText('event emoji')
  expect(emojis.length).toBe(1)

  expect(emojis[0].getAttribute('alt')).toBe(emoji)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.emojiList.emojis.length).toBe(1)
})

it('should remove an existing emoji', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => faker.random.arrayElement(DEFAULT_EMOJIS).name,
  )
  const event = fakeEvent({
    template: fakeSimpleBlog({emojiList: {emojis}}),
  })
  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('emoji list'))

  fireEvent.click((await findAllByLabelText('remove emoji'))[0])

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findAllByLabelText('event emoji')).length).toBe(
    emojis.length - 1,
  )

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.emojiList.emojis.length).toBe(emojis.length - 1)
})

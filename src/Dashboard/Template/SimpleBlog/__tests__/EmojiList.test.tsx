import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {inputElementFor, render} from '__utils__/render'
import {ALL_EMOJIS, EMOJI} from 'Dashboard/components/EmojiList/emoji'
import {setWindowMatchMedia} from '__utils__/media-query'
import {
  findByLabelText,
  fireEvent,
  queryByLabelText,
} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'

beforeAll(() => {
  // Required to render <Hidden/> components in tests
  setWindowMatchMedia()
})

it('should render emojis', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.random.arrayElement(ALL_EMOJIS).name,
  )

  const withEmojis = (
    <Dashboard
      isEditMode={false}
      dashboard={fakeSimpleBlog({
        emojiList: {
          emojis,
        },
      })}
      user={fakeUser()}
    />
  )

  const {findAllByLabelText, rerender, queryByLabelText} = render(
    <Dashboard
      isEditMode={false}
      dashboard={fakeSimpleBlog({
        emojiList: {
          emojis: [],
        },
      })}
      user={fakeUser()}
    />,
  )

  expect(queryByLabelText('event emoji')).not.toBeInTheDocument()

  rerender(withEmojis)

  const emojiEl = await findAllByLabelText('event emoji')
  expect(emojiEl.length).toBe(emojis.length)
})

it('should pick an emoji', async () => {
  const {findByLabelText, findAllByLabelText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        emojiList: {
          emojis: [],
        },
      })}
      user={fakeUser()}
    />,
  )

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
})

it('should remove an existing emoji', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.random.arrayElement(ALL_EMOJIS).name,
  )
  const {findByLabelText, findAllByLabelText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        emojiList: {
          emojis,
        },
      })}
      user={fakeUser()}
    />,
  )

  clickEdit(await findByLabelText('emoji list'))

  fireEvent.click((await findAllByLabelText('remove emoji'))[0])

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findAllByLabelText('event emoji')).length).toBe(
    emojis.length - 1,
  )
})

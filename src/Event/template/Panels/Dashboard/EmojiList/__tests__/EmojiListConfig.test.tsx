import React from 'react'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, inputElementFor, render} from '__utils__/render'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {DEFAULT_EMOJIS, EMOJI} from 'Event/Dashboard/components/emoji'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should pick an emoji', async () => {
  const event = fakeEvent({
    template: fakePanels({
      emojiList: {
        emojis: [],
      },
    }),
  })

  const {findByLabelText, findAllByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
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
    template: fakePanels({emojiList: {emojis}}),
  })
  const {findByLabelText, findAllByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
  )

  clickEdit(await findByLabelText('emoji list'))

  fireEvent.click((await findAllByLabelText('remove emoji'))[0])

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

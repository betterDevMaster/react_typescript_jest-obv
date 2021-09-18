import React from 'react'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {DEFAULT_EMOJIS} from 'Event/Dashboard/components/EmojiList/emoji'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render emojis', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.random.arrayElement(DEFAULT_EMOJIS).name,
  )
  const withEmojis = fakeEvent({
    template: fakePanels({
      emojiList: {
        emojis,
      },
    }),
  })

  const {findAllByLabelText} = await goToDashboardConfig({
    event: withEmojis,
  })

  const emojiEl = await findAllByLabelText('event emoji')
  expect(emojiEl.length).toBe(emojis.length)
})

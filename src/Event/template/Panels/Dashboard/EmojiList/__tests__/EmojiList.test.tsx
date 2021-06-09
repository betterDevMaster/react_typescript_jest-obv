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

it('should render emojis', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.random.arrayElement(DEFAULT_EMOJIS).name,
  )

  const withoutEmojis = fakeEvent({
    template: fakePanels({
      emojiList: {
        emojis: [],
      },
    }),
  })

  const withEmojis = fakeEvent({
    template: fakePanels({
      emojiList: {
        emojis,
      },
    }),
  })
  

  const {findAllByLabelText, rerender, queryByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: withoutEmojis,
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
  )

  expect(queryByLabelText('event emoji')).not.toBeInTheDocument()

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, {
    event: withEmojis,
  })

  const emojiEl = await findAllByLabelText('event emoji')
  expect(emojiEl.length).toBe(emojis.length)
})
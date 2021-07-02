import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import {render} from '__utils__/render'
import {wait} from '@testing-library/react'
import EmojiPage from 'organization/Event/EmojiPage'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {EMOJI} from 'Event/Dashboard/components/EmojiList/emoji'

const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show user clicked emojis', async () => {
  const event = fakeEvent()
  const organization = fakeOrganization()

  const allEmojis = Object.values(EMOJI).map(({name}) => name)
  const numEmojis = faker.random.number({min: 1, max: 3})
  const emojis = Array.from({length: numEmojis}, () =>
    faker.random.arrayElement(allEmojis),
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: emojis})) // returns emojis
  mockGet.mockImplementation(() => Promise.resolve({data: []})) // returns nothing after

  const {findAllByLabelText, queryAllByLabelText} = render(<EmojiPage />, {
    organization,
    event,
  })

  expect((await findAllByLabelText('emoji')).length).toBe(numEmojis)

  await wait(
    () => {
      expect(queryAllByLabelText('emoji').length).toBe(0)
    },
    {
      timeout: 20000,
    },
  )
})

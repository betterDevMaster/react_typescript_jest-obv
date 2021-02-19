import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import App from 'App'
import {render} from '__utils__/render'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {EMOJI} from 'Event/Dashboard/components/EmojiList/emoji'
import {goToEvent} from 'organization/Event/__utils__/event'

const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show user clicked emojis', async () => {
  const event = fakeEvent()
  const data = goToEvent({event})

  const {findByLabelText, findAllByLabelText, queryAllByLabelText} = render(
    <App />,
  )

  const allEmojis = Object.values(EMOJI).map(({name}) => name)
  const numEmojis = faker.random.number({min: 1, max: 10})
  const emojis = Array.from({length: numEmojis}, () =>
    faker.random.arrayElement(allEmojis),
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: emojis})) // returns emojis
  mockGet.mockImplementation(() => Promise.resolve({data: []})) // returns nothing after

  user.click(await findByLabelText(`view ${event.name}`))

  // Wait for areas to finish loading or we run into hash
  // change error
  expect(
    await findByLabelText(`view ${data.areas[0].name} area`),
  ).toBeInTheDocument()

  user.click(await findByLabelText('view emoji page'))

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

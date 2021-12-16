import React from 'react'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {wait} from '@testing-library/dom'
import faker from 'faker'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

it('inserts HTML into dashboard body', async () => {
  const myFunc = jest.fn()
  // @ts-ignore
  global.window.myFunc = myFunc
  const text = faker.random.word()

  const event = fakeEvent({
    template: fakeFiftyBlog({
      bodyHTMLEmbed: `
        <script>
          myFunc();
        </script>
        <h1>${text}</h1>
      `,
    }),
  })

  const {findByText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      waiver: 'somewaiver.pdf',
      tech_check_completed_at: 'now',
    }),
  })

  await wait(() => {
    expect(myFunc).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(text)).toBeInTheDocument()
})

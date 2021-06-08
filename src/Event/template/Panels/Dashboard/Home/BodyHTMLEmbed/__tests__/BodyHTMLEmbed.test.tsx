import React from 'react'
import {
  fakeHeader,
  fakeSimpleBlog,
} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {wait} from '@testing-library/dom'
import faker from 'faker'

afterEach(() => {
  jest.clearAllMocks()
})

it('inserts HTML into dashboard body', async () => {
  const myFunc = jest.fn()
  // @ts-ignore
  global.window.myFunc = myFunc
  const text = faker.random.word()

  const event = fakeEvent({
    template: fakeSimpleBlog({
      header: fakeHeader({
        script: 'myFunc()',
      }),

      bodyHTMLEmbed: `
        <script>
          myFunc();
        </script>
        <h1>${text}</h1>
      `,
    }),
  })

  const {findByText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: event,
      score: defaultScore,
      actions: emptyActions,
      withRouter: true,
    },
  )

  await wait(() => {
    expect(myFunc).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(text)).toBeInTheDocument()
})

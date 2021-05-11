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
import CustomScripts from 'organization/Event/CustomScripts'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render a header', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })

  const {findByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: event,
      score: defaultScore,
      actions: emptyActions,
      withRouter: true,
    },
  )
  expect(await findByLabelText('show side menu')).toBeInTheDocument()
})

it('should run custom header script', async () => {
  const myFunc = jest.fn()
  // @ts-ignore
  global.window.myFunc = myFunc

  const event = fakeEvent({
    template: fakeSimpleBlog({
      header: fakeHeader({
        script: 'myFunc()',
      }),
    }),
  })

  render(
    <CustomScripts>
      <Dashboard isEditMode={false} user={fakeUser()} />
    </CustomScripts>,
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
})

import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakePoints} from 'Event/Dashboard/components/PointsSummary/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'

it('should render points', async () => {
  const dashboard = fakeSimpleBlog({points: null})

  const {queryByText, rerender, findByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints({
    unit: 'foo',
  })
  const dashboardWithPoints = fakeSimpleBlog({
    points,
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={dashboardWithPoints}
      user={fakeUser()}
    />,
  )

  const pointsText = new RegExp(
    `you've earned ${points.numPoints} ${points.unit}!`,
    'i',
  )

  expect(await findByText(pointsText)).toBeInTheDocument()
})

it('should configure points', async () => {
  const event = fakeEvent()
  const {queryByText, findByLabelText, findByText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({
          points: null,
        })}
        user={fakeUser()}
      />
    </StaticEventProvider>,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('set points'))

  const unit = faker.random.word()
  user.type(await findByLabelText('points unit'), unit)

  fireEvent.click(await findByLabelText('close config dialog'))

  const pointsText = new RegExp(`you've earned 0 ${unit}!`, 'i')

  expect(await findByText(pointsText)).toBeInTheDocument()
})

it('should remove points', async () => {
  const event = fakeEvent()
  const {queryByText, findByLabelText, findByText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({
          points: fakePoints({numPoints: 0}),
        })}
        user={fakeUser()}
      />
    </StaticEventProvider>,
  )

  expect(await findByText(/you've earned 0 .*/i)).toBeInTheDocument()

  clickEdit(await findByLabelText('points summary'))

  fireEvent.click(await findByLabelText('remove points'))

  await wait(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })
})

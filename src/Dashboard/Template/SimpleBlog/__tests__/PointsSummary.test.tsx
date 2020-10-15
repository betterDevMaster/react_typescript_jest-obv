import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {fireEvent, waitFor} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'

it('should render points', async () => {
  const dashboard = fakeSimpleBlog({points: null})

  const {queryByText, rerender, findByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints()
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
  const {queryByText, findByLabelText, findByText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        points: null,
      })}
      user={fakeUser()}
    />,
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
  const {queryByText, findByLabelText, findByText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        points: fakePoints({numPoints: 0}),
      })}
      user={fakeUser()}
    />,
  )

  expect(await findByText(/you've earned 0 .*/i)).toBeInTheDocument()

  clickEdit(await findByLabelText('points summary'))

  fireEvent.click(await findByLabelText('remove points'))

  await waitFor(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })
})

import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'organization/event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'organization/event/Dashboard'
import {render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'

it('should show the welcome text', async () => {
  const dashboard = fakeSimpleBlog()
  const {findByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )
  expect(await findByText(dashboard.welcomeText)).toBeInTheDocument()
})

it('should udpate the text value', async () => {
  const text = faker.random.words(3)
  const dashboard = fakeSimpleBlog({welcomeText: text})

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  expect((await findByLabelText('welcome')).textContent).toBe(text)

  clickEdit(await findByLabelText('welcome'))
  const newVal = faker.random.word()

  fireEvent.change(await findByLabelText('edit welcome text'), {
    target: {
      value: newVal,
    },
  })
  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('welcome')).textContent).toBe(newVal)
})

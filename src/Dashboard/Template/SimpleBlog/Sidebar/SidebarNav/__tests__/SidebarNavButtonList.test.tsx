import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {
  fakeNavButton,
  fakeNavButtonWithSize,
} from 'Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'

it('should render sidebarNavButtons', () => {
  const dashboard = fakeSimpleBlog({
    sidebarNavButtons: createEntityList([]),
  })

  const {queryByLabelText, rerender, queryAllByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/sidebar nav/i)).not.toBeInTheDocument()

  const numButtons = faker.random.number({min: 1, max: 5})

  const withNavButtons = fakeSimpleBlog({
    sidebarNavButtons: createEntityList(
      Array.from({length: numButtons}, fakeNavButton),
    ),
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withNavButtons}
      user={fakeUser()}
    />,
  )

  expect(queryAllByLabelText(/sidebar nav/i).length).toBe(numButtons)
})

it('should add a new sidebar nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        sidebarNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttonEls = () => findAllByLabelText('sidebar nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add sidebar nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)
})

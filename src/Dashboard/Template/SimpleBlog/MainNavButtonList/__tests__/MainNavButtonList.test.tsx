import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakeNavButtonWithSize} from 'Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'

it('should render main nav buttons', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const {findAllByLabelText} = render(
    <Dashboard
      isEditMode={false}
      dashboard={fakeSimpleBlog({
        mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttonsEls = await findAllByLabelText('main nav button')
  expect(buttonsEls.length).toBe(mainNavButtons.ids.length)
})

it('should add a new main nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttonEls = () => findAllByLabelText('main nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add main nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)
})

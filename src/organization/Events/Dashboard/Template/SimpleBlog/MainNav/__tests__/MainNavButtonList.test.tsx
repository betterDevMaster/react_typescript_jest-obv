import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'organization/Events/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'organization/Events/Dashboard'
import {render} from '__utils__/render'
import {fakeNavButtonWithSize} from 'organization/Events/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
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
        mainNav: mainNavButtons,
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
        mainNav: mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttonEls = () => findAllByLabelText('main nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add main nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const {findByLabelText, findByText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        mainNav: mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const button = faker.random.arrayElement(buttons)
  const buttonEl = await findByText(button.text)

  clickEdit(buttonEl)

  const textInput = (await findByLabelText(
    'button name input',
  )) as HTMLInputElement
  expect(textInput.value).toBe(button.text)

  const updatedValue = faker.random.word()

  fireEvent.change(textInput, {
    target: {
      value: updatedValue,
    },
  })

  fireEvent.click(await findByLabelText('close config dialog'))

  const updatedEl = await findByText(updatedValue)
  expect(updatedEl).toBeInTheDocument()
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButtonWithSize)
  const mainNavButtons = createEntityList(buttons)

  const {findAllByLabelText, findByLabelText, queryByText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({
        mainNav: mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttonEls = () => findAllByLabelText('main nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()
})

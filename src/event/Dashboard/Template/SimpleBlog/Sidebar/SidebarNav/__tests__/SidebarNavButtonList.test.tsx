import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'

it('should render sidebarNavButtons', () => {
  const dashboard = fakeSimpleBlog({
    sidebarNav: createEntityList([]),
  })

  const {queryByLabelText, rerender, queryAllByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/sidebar nav/i)).not.toBeInTheDocument()

  const numButtons = faker.random.number({min: 1, max: 5})

  const withNavButtons = fakeSimpleBlog({
    sidebarNav: createEntityList(
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
  const event = fakeEvent()

  const {findAllByLabelText, findByLabelText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({
          sidebarNav: sidebarNavButtons,
        })}
        user={fakeUser()}
      />
    </StaticEventProvider>,
  )

  const buttonEls = () => findAllByLabelText('sidebar nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add sidebar nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent()
  const {findByLabelText, findByText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({
          sidebarNav: sidebarNavButtons,
        })}
        user={fakeUser()}
      />
    </StaticEventProvider>,
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

  const buttons = Array.from({length: numButtons}, fakeNavButton)
  const sidebarNavButtons = createEntityList(buttons)

  const event = fakeEvent()
  const {findAllByLabelText, findByLabelText, queryByText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({
          sidebarNav: sidebarNavButtons,
        })}
        user={fakeUser()}
      />
    </StaticEventProvider>,
  )

  const buttonEls = () => findAllByLabelText('sidebar nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()
})

import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import mockAxios from 'axios'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import StaticAreasProvider from 'organization/Event/__utils__/StaticAreasProvider'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: mainNavButtons,
    }),
  })
  const {findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: emptyActions,
      withRouter: true,
      score: defaultScore,
    },
  )

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
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

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = data.template.mainNav.ids[targetIndex]
  expect(data.template.mainNav.entities[id].text).toBe(updatedValue)
})

it('should set an area button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: mainNavButtons,
    }),
  })

  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeArea,
  )

  const {findByLabelText, findByText} = render(
    <StaticAreasProvider areas={areas}>
      <Dashboard isEditMode={true} user={fakeUser()} />
    </StaticAreasProvider>,
    {
      event,
      organization: fakeOrganization(),
      actions: emptyActions,
      withRouter: true,
      score: defaultScore,
    },
  )

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
  const buttonEl = await findByText(button.text)

  const target = faker.random.arrayElement(areas)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  clickEdit(buttonEl)

  user.click(await findByLabelText('configure button to join room'))

  /**
   * Material UI select expects mouseDown instead of a click
   */
  fireEvent.mouseDown(await findByLabelText('pick area'))
  user.click(await findByLabelText(`pick ${target.name}`))

  fireEvent.click(await findByLabelText('close config dialog'))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = data.template.mainNav.ids[targetIndex]
  expect(data.template.mainNav.entities[id]['isAreaButton']).toBe(true)
  expect(data.template.mainNav.entities[id]['areaId']).toBe(target.id) // Set area ID
})

it('should assign an action for points', async () => {
  const button = fakeNavButtonWithSize()
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: createEntityList([button]),
    }),
  })

  const actions = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeAction(),
  )

  const {findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions,
      withRouter: true,
      score: defaultScore,
    },
  )

  const buttonEl = await findByText(button.text)

  const target = faker.random.arrayElement(actions)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions}))

  clickEdit(buttonEl)

  /**
   * Material UI select expects mouseDown instead of a click
   */
  fireEvent.mouseDown(await findByLabelText('pick action'))
  user.click(await findByLabelText(`pick ${target.description}`))

  fireEvent.click(await findByLabelText('close config dialog'))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const id = data.template.mainNav.ids[0] // only one button
  expect(data.template.mainNav.entities[id]['actionId']).toBe(target.key) // Did assign action id
})

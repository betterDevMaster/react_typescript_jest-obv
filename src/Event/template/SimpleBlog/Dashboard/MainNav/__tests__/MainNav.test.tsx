import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render main nav buttons', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const {findAllByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: fakeEvent({
        template: fakeSimpleBlog({
          mainNav: mainNavButtons,
        }),
      }),
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
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
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: mainNavButtons,
    }),
  })

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
  )

  const buttonEls = () => findAllByLabelText('main nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add main nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.mainNav.ids.length).toBe(numButtons + 1)
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
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: mainNavButtons,
    }),
  })

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
  )

  const buttonEls = () => findAllByLabelText('main nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add main nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.mainNav.ids.length).toBe(numButtons + 1)
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButtonWithSize)
  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({mainNav: mainNavButtons}),
  })

  const {findAllByLabelText, findByLabelText, queryByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
  )

  const buttonEls = () => findAllByLabelText('main nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.mainNav.ids.length).toBe(numButtons - 1)
})

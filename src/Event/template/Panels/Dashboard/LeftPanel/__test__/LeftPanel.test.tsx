import React from 'react'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {fireEvent, wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render left panel', async () => {
  const {findByLabelText, queryByText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: fakeEvent({template: fakePanels(), logo: null}),
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
  )

  expect(await findByLabelText('left panel')).toBeInTheDocument()
  expect(queryByText('left panel menu Home button')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('menu icon button'))

  expect(
    await findByLabelText('left panel menu Home button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('left panel menu Speakers button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('left panel menu Resources button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('left panel menu Points button'),
  ).toBeInTheDocument()
})

it('should render right panel', async () => {
  const event = fakeEvent({template: fakePanels(), logo: null})

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization: fakeOrganization(),
      actions: [],
      score: defaultScore,
      withRouter: true,
    },
  )

  clickEdit(await findByLabelText('left panel'))

  const color = '#666666'
  user.type(await findByLabelText('left panel bar background color'), color)

  await wait(async () => {
    expect(await findByLabelText('left panel')).toHaveStyle(
      `background-color: ${rgba(color)}`,
    )
  })
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
})

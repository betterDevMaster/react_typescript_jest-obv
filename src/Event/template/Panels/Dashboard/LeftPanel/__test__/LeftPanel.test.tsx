import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

it('should render left panel', async () => {
  const {findByLabelText, queryByText} = await goToDashboardConfig({
    event: fakeEvent({template: fakePanels(), logo: null}),
  })

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

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('left panel'))

  const color = '#666666'
  user.type(await findByLabelText('left panel bar background color'), color)

  await wait(async () => {
    expect(await findByLabelText('left panel')).toHaveStyle(
      `background-color: ${rgba(color)}`,
    )
  })
})

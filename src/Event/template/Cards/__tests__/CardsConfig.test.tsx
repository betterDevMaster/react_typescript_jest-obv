import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

afterEach(() => {
  jest.clearAllMocks()
})

it('should configure a header color settings', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('header'))

  const color = '#e2e2e2'
  user.type(await findByLabelText('header background color'), color)

  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect(await findByLabelText('header')).toHaveStyle(
      `background-color: ${rgba(color)}`,
    )
  })
})

import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {DeepRequired} from 'lib/type-utils'
import {Panels} from 'Event/template/Panels'
import {loginToEventSite} from 'Event/__utils__/url'

afterEach(() => {
  jest.clearAllMocks()
})

it('should hide home button', async () => {
  const template = fakePanels() as DeepRequired<Panels>

  // Hide all tabs/sections
  template.resourceList.isVisible = false
  template.leaderboard.isVisible = false
  template.speakers.isVisible = false
  template.sponsors.isVisible = false
  template.imageWaterfall.isVisible = false
  template.faq.isVisible = false

  const event = fakeEvent({template, logo: null})

  const {findByLabelText} = await loginToEventSite({
    event,
  })

  // Home button should also be hidden
  expect(await findByLabelText('panels tab home')).toHaveStyle('display: none;')
})

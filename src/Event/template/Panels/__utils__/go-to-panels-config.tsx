import axios from 'axios'
import {EventOverrides} from 'organization/Event/__utils__/event'
import {Area} from 'organization/Event/AreasProvider'
import {Action} from 'Event/ActionsProvider'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {Sponsor} from 'Event/SponsorPage'
import {wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock

type Overrides = EventOverrides & {
  areas?: Area[]
  actions?: Action[]
  sponsors?: Sponsor[]
}

export async function goToPanelsConfig(overrides: Overrides = {}) {
  const sponsors = overrides.sponsors || []

  const context = await goToDashboardConfig({
    ...overrides,
    beforeClick: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: sponsors}))
    },
  })

  /**
   * Required to make sure all requests have 'resolved', and we don't
   * run into updating state without act errors.
   */
  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(12)
  })

  return context
}

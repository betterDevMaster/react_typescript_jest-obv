import {goToWaiverConfig} from 'Event/Step2/__utils__/go-to-waiver-config'
import {ENTERPRISE, PROFESSIONAL} from 'obvio/Billing/plans'
import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {allTemplates} from 'Event/template/__utils__/tester'

beforeAll(() => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )
})

allTemplates(
  'should only show additional waivers for enterprise',
  async (fakeTemplate) => {
    const {queryByText} = await goToWaiverConfig({
      userPermissions: [CONFIGURE_EVENTS],
      owner: fakeTeamMember({
        plan: fakePlan({
          name: PROFESSIONAL,
        }), // not enterprise
      }),
      event: fakeEvent({
        template: fakeTemplate(),
      }),
    })

    await wait(() => {
      expect(queryByText(/additional waivers/i)).not.toBeInTheDocument()
    })
  },
)

allTemplates(
  'should disable additional waivers button',
  async (fakeTemplate) => {
    const owner = fakeTeamMember({
      plan: fakePlan({
        name: ENTERPRISE, // correct plan
      }),
    })
    const {findByText} = await goToWaiverConfig({
      userPermissions: [CONFIGURE_EVENTS],
      owner: owner,
      event: fakeEvent({
        waiver: null, // no default waiver set
        template: fakeTemplate(),
      }),
    })

    // Is disabled without a waiver set
    expect(await findByText(/additional waivers/i)).toBeDisabled()
  },
)

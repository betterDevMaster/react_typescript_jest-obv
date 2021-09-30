import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {ImageEntry} from 'organization/Event/ImageEntriesProvider'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import Action from 'pusher-js/types/src/core/connection/protocol/action'

const mockGet = axios.get as jest.Mock

export async function goToImageEntries(
  overrides: EventOverrides & {
    imageEntries?: ImageEntry[]
    hasNextPage?: boolean
    actions?: Action[]
  } = {},
) {
  const actions = overrides.actions || []
  const userPermissions = overrides.userPermissions || [CONFIGURE_EVENTS]

  const imageEntries = overrides.imageEntries || []
  const hasNextPage = overrides.hasNextPage || false

  const context = await goToEventConfig({
    ...overrides,
    userPermissions,
  })

  /**
   * Fetch actions
   */
  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions}))

  /**
   * Fetch entries
   */
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: imageEntries,
        has_next_page: hasNextPage,
      },
    }),
  )

  user.click(await context.findByText(/image entries/i))

  return context
}

import faker from 'faker'
import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {Form} from 'organization/Event/FormsProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Action} from 'Event/ActionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToForm(
  overrides: {form?: Form; actions?: Action[]} & EventOverrides = {},
) {
  const form = overrides.form || fakeForm()

  const event =
    overrides.event ||
    fakeEvent({
      forms: [form],
    })

  const context = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
    event,
    ...overrides,
  })

  // Actions
  const actions =
    overrides.actions ||
    Array.from({length: faker.random.number({min: 2, max: 4})}, fakeAction)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions}))

  user.click(await context.findByLabelText('configure forms'))

  user.click(await context.findByText(form.name))

  return {...context, form}
}

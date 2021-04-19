import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {Form} from 'organization/Event/FormsProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

export async function goToForm(overrides: {form?: Form} & EventOverrides = {}) {
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

  user.click(await context.findByLabelText('configure forms'))

  user.click(await context.findByText(form.name))

  return {...context, form}
}

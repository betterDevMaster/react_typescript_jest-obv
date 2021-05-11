import faker from 'faker'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToFormsConfig} from 'organization/Event/FormsConfig/__utils__/go-to-forms-config'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

it('should show forms', async () => {
  const numForms = faker.random.number({min: 2, max: 5})

  const forms = Array.from({length: numForms}, fakeForm)
  const event = fakeEvent({
    forms,
  })

  const {findAllByLabelText} = await goToFormsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  expect((await findAllByLabelText('form')).length).toBe(numForms)
})

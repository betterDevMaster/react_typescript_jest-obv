import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToFormsConfig} from 'organization/Event/FormsConfig/__utils__/go-to-forms-config'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/react'

const mockPost = axios.post as jest.Mock

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

it('should duplicate a form', async () => {
  const numForms = faker.random.number({min: 2, max: 5})

  const forms = Array.from({length: numForms}, fakeForm)
  const event = fakeEvent({
    forms,
  })

  const {findAllByLabelText, findAllByText} = await goToFormsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: numForms - 1})
  const target = forms[targetIndex]

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        ...target,
        id: 99999, // some new id
      },
    }),
  )

  user.click((await findAllByLabelText('duplicate form'))[targetIndex])

  await wait(async () => {
    expect((await findAllByText(target.name)).length).toBe(2)
  })

  expect((await findAllByLabelText('form')).length).toBe(numForms + 1)

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/forms/${target.id}`)
})

import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'
import {fireEvent} from '@testing-library/dom'
import faker from 'faker'
import {wait} from '@testing-library/react'

const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update a form name', async () => {
  const {findByLabelText, form} = await goToForm({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const name = faker.random.word()
  fireEvent.change(await findByLabelText('form name'), {
    target: {
      value: name,
    },
  })

  const updated = {
    ...form,
    name,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save name'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/forms/${form.id}`)
  expect(data.name).toBe(name)
})

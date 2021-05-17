import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToFormsConfig} from 'organization/Event/FormsConfig/__utils__/go-to-forms-config'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/dom'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a new form', async () => {
  const numForms = faker.random.number({min: 2, max: 5})

  const forms = Array.from({length: numForms}, fakeForm)
  const event = fakeEvent({
    forms,
  })

  const {findAllByLabelText, findByLabelText, findByText} =
    await goToFormsConfig({
      event,
      userPermissions: [CONFIGURE_EVENTS],
    })

  user.click(await findByLabelText('add form'))

  const name = faker.random.word()
  user.type(await findByLabelText('form name'), name)

  const form = fakeForm({name})

  mockPost.mockImplementationOnce(() => Promise.resolve({data: form}))

  user.click(await findByLabelText('create'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByLabelText('form')).length).toBe(numForms + 1)

  expect(await findByText(name)).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/forms`)
  expect(data.name).toBe(name)
})

import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToFormsConfig} from 'organization/Event/FormsConfig/__utils__/go-to-forms-config'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/dom'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'

const mockDelete = axios.delete as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should remove a form', async () => {
  const numForms = faker.random.number({min: 2, max: 5})

  const forms = Array.from({length: numForms}, fakeForm)
  const event = fakeEvent({
    forms,
  })

  const {
    findAllByLabelText,
    findByLabelText,
    findByText,
    queryByText,
  } = await goToFormsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: forms.length - 1})
  const target = forms[targetIndex]

  user.click(await findByText(target.name))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'deleted'}))

  user.click(await findByLabelText('delete form'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByLabelText('form')).length).toBe(numForms - 1)

  expect(queryByText(target.name)).not.toBeInTheDocument()

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/forms/${target.id}`)
})

it('should export submissons for a form', async () => {
  const {findByLabelText, findByText} = await goToForm()

  const message = 'exported!'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export submissions'))

  expect(await findByText(message)).toBeInTheDocument()
})

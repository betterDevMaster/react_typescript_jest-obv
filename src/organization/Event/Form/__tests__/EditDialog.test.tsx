import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {wait} from '@testing-library/dom'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
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

it('should update an existing question', async () => {
  const question = fakeQuestion()

  const form = fakeForm({
    questions: [question],
  })

  const {findByLabelText, findByText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('edit question'))

  const label = faker.random.words(3)
  user.type(await findByLabelText('question label'), label)

  const updated = {
    ...question,
    label,
  }

  const updatedForm = {
    ...form,
    questions: [updated],
  }

  mockPatch.mockImplementation(() => Promise.resolve({data: updatedForm}))

  user.click(await findByLabelText('save'))
  user.click(await findByLabelText('save form'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/forms/${form.id}`)
  expect(data.questions[0].label).toBe(label)

  expect(await findByText(label)).toBeInTheDocument()
})

it('should download answers', async (done) => {
  const question = fakeQuestion()
  const form = fakeForm({
    questions: [question],
  })

  const {findByLabelText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('edit question'))

  const csv = faker.random.alphaNumeric(20)

  window.URL.createObjectURL = jest.fn()
  window.URL.revokeObjectURL = jest.fn()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {data: csv}}))

  user.click(await findByLabelText(`export ${question.label} submissions`))

  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0]

  // Test that we are downloading returned file contents
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    expect(reader.result).toBe(csv)
    done()
    // reader.result contains the contents of blob as a typed array
  })
  reader.readAsText(blob)
})

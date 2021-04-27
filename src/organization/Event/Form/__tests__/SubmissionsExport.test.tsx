import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should download answers', async (done) => {
  const numQuestions = faker.random.number({min: 1, max: 3})
  const questions = Array.from({length: numQuestions}, fakeQuestion)
  const form = fakeForm({questions})

  const csv = faker.random.alphaNumeric(20)

  window.URL.createObjectURL = jest.fn()
  window.URL.revokeObjectURL = jest.fn()

  const {findByLabelText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {data: csv}}))

  user.click(await findByLabelText('export submissions'))

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
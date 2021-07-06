import axios from 'axios'
import user from '@testing-library/user-event'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

it('should export submissions for a form', async () => {
  const {findByLabelText, findByText} = await goToForm()

  const message = 'Form export request received!'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export submissions'))

  expect(await findByText(message)).toBeInTheDocument()
})

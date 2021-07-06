import axios from 'axios'
import user from '@testing-library/user-event'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

it('should export submissions for a question', async () => {
  const questions = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeQuestion,
  )

  const form = fakeForm({
    questions,
  })

  const {findAllByLabelText, findByText, findByLabelText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: questions.length - 1})
  const target = questions[targetIndex]

  user.click((await findAllByLabelText('edit question'))[targetIndex])

  const message = 'Question submissions export request received!'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText(`export ${target.label} submissions`))

  expect(await findByText(message)).toBeInTheDocument()
})

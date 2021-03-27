import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {wait} from '@testing-library/dom'
import axios from 'axios'
import {goToQuestionsConfig} from 'organization/Event/QuestionsConfig/__utils__/go-to-questions-config'

const mockPut = axios.put as jest.Mock
const mockGet = axios.get as jest.Mock

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
  const question = fakeQuestion({is_registration_question: true})
  const event = fakeEvent({
    questions: [question],
  })

  const {findByLabelText, findByText} = await goToQuestionsConfig({event})

  user.click(await findByLabelText('edit question'))

  const label = faker.random.words(3)
  user.type(await findByLabelText('question label'), label)

  const updated = {
    ...question,
    label,
  }

  mockPut.mockImplementation(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/questions/${question.id}`)
  expect(data.label).toBe(label)

  expect(await findByText(label)).toBeInTheDocument()
})

it('should download answers', async (done) => {
  const question = fakeQuestion({is_registration_question: true})
  const event = fakeEvent({
    questions: [question],
  })

  const {findByLabelText} = await goToQuestionsConfig({event})

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

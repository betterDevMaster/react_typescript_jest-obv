import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {wait} from '@testing-library/dom'
import axios from 'axios'
import {goToQuestionsConfig} from 'organization/Event/QuestionsConfig/__utils__/go-to-questions-config'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
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

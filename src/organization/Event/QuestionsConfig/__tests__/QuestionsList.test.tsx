import {fakeEvent} from 'Event/__utils__/factory'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {goToQuestionsConfig} from 'organization/Event/QuestionsConfig/__utils__/go-to-questions-config'
import user from '@testing-library/user-event'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockDelete = axios.delete as jest.Mock

it('should render questions', async () => {
  const numQuestions = faker.random.number({min: 1, max: 3})
  const questions = Array.from({length: numQuestions}, () =>
    fakeQuestion({is_registration_question: true}),
  )
  const event = fakeEvent({
    questions,
  })

  const {findByText} = await goToQuestionsConfig({event})

  for (const question of questions) {
    expect(await findByText(question.label)).toBeInTheDocument()
  }
})

it('should remove a question', async () => {
  const questions = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeQuestion,
  )

  const event = fakeEvent({questions})
  const {
    findAllByLabelText,
    queryByText,
    findByLabelText,
  } = await goToQuestionsConfig({event})

  const targetIndex = faker.random.number({min: 0, max: questions.length - 1})
  const target = questions[targetIndex]

  user.click((await findAllByLabelText('edit question'))[targetIndex])

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('remove question'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(target.label)).not.toBeInTheDocument()
})

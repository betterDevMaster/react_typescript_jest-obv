import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {goToQuestionsConfig} from 'organization/Event/QuestionsConfig/__utils__/go-to-questions-config'

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

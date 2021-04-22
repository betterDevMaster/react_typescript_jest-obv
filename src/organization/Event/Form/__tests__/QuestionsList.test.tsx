import faker from 'faker'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import user from '@testing-library/user-event'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'

const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render questions', async () => {
  const numQuestions = faker.random.number({min: 1, max: 3})
  const questions = Array.from({length: numQuestions}, fakeQuestion)

  const form = fakeForm({
    questions,
  })

  const {findByText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  for (const question of questions) {
    expect(await findByText(question.label)).toBeInTheDocument()
  }
})

it('should remove a question', async () => {
  const questions = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeQuestion,
  )

  const form = fakeForm({
    questions,
  })

  const {findAllByLabelText, queryByText, findByLabelText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: questions.length - 1})
  const target = questions[targetIndex]

  user.click((await findAllByLabelText('edit question'))[targetIndex])

  const removed = {
    ...form,
    questions: form.questions.filter((q) => q.id !== target.id),
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: removed}))

  user.click(await findByLabelText('remove question'))

  user.click(await findByLabelText('save form'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/forms/${form.id}`)
  expect(data.questions.length).toBe(questions.length - 1)

  expect(queryByText(target.label)).not.toBeInTheDocument()
})

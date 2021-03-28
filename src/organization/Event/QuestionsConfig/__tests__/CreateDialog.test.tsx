import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {
  fakeQuestion,
  randomRule,
  randomType,
  ruleLabel,
  typeLabel,
} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import axios from 'axios'
import {CHECKBOX, RADIO, SELECT} from 'organization/Event/QuestionsProvider'
import {goToQuestionsConfig} from 'organization/Event/QuestionsConfig/__utils__/go-to-questions-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('add a question', async () => {
  const event = fakeEvent({
    questions: [],
  })

  const {findByLabelText, findByText} = await goToQuestionsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add question'))

  const label = faker.random.words(3)
  user.type(await findByLabelText('question label'), label)

  const type = randomType()

  fireEvent.mouseDown(await findByLabelText('question type'))
  user.click(await findByText(typeLabel(type)))

  const helperText = faker.lorem.paragraph()
  user.type(await findByLabelText('helper text'), helperText)

  const hasRule = faker.random.boolean()
  const rule = randomRule()
  if (hasRule) {
    fireEvent.mouseDown(await findByLabelText('validation rule'))
    user.click(await findByText(ruleLabel(rule)))
  }

  const isRequired = faker.random.boolean()
  if (!isRequired) {
    user.click(await findByLabelText('is optional'))
  }

  const question = fakeQuestion({
    is_registration_question: true,
  })

  mockPost.mockImplementation(() => Promise.resolve({data: question}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/questions`)

  expect(data.label).toBe(label)
  expect(data.helper_text).toBe(helperText)
  expect(data.type).toBe(type)

  if (hasRule) {
    expect(data.validation_rule).toBe(rule)
  }

  expect(data.is_required).toBe(isRequired)
  expect(data.is_registration_question).toBe(true)

  // Added created queston
  expect(await findByText(question.label)).toBeInTheDocument()
})

it('should create a question with options', async () => {
  const event = fakeEvent({
    questions: [],
  })

  const {
    findByLabelText,
    findByText,
    findAllByLabelText,
  } = await goToQuestionsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add question'))

  user.type(await findByLabelText('question label'), faker.random.word())

  const type = faker.random.arrayElement([RADIO, CHECKBOX, SELECT])
  fireEvent.mouseDown(await findByLabelText('question type'))
  user.click(await findByText(typeLabel(type)))

  const numOptions = faker.random.number({min: 2, max: 5})
  const options = Array.from({length: numOptions}, faker.random.word)

  for (const option of options) {
    user.click(await findByLabelText('add option'))

    const optionInputs = await findAllByLabelText('question option')
    const lastInput = optionInputs[optionInputs.length - 1]

    user.type(lastInput, option)
  }

  // remove an option
  const removeTargetIndex = faker.random.number({min: 0, max: numOptions - 1})
  user.click((await findAllByLabelText('remove option'))[removeTargetIndex])

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPost.mock.calls[0]

  // Did remove option
  expect(data.options.length).toBe(numOptions - 1)

  // Did save correct options
  for (const savedOption of data.options) {
    expect(options.includes(savedOption)).toBe(true)
  }
})

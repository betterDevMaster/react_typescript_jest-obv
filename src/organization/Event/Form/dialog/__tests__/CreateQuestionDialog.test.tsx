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
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {goToForm} from 'organization/Event/Form/__utils__/go-to-form'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'

const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should add a question', async () => {
  const form = fakeForm({questions: []})

  const {findByLabelText, findByText} = await goToForm({
    form,
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

  const question = fakeQuestion({})

  user.click(await findByLabelText('save question'))

  const added = {
    ...form,
    questions: [...form.questions, question],
  }

  mockPatch.mockImplementation(() => Promise.resolve({data: added}))

  user.click(await findByLabelText('save form'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`forms/${form.id}`)
  expect(data.questions.length).toBe(1)

  expect(data.questions[0].label).toBe(label)
  expect(data.questions[0].helper_text).toBe(helperText)
  expect(data.questions[0].type).toBe(type)

  if (hasRule) {
    expect(data.questions[0].validation_rule).toBe(rule)
  }

  expect(data.questions[0].is_required).toBe(isRequired)

  // Added created queston
  expect(await findByText(question.label)).toBeInTheDocument()
})

it('should create a question with options', async () => {
  const form = fakeForm({questions: []})

  const actions = Array.from({length: 3}, fakeAction)

  const {findByLabelText, findByText, findAllByLabelText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
    actions,
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

  /**
   * Select action for option
   */
  const actionOptionIndex = faker.random.number({min: 0, max: numOptions - 2}) // -2 because we've removed an option
  const targetAction = faker.random.arrayElement(actions)
  fireEvent.mouseDown(
    (await findAllByLabelText('pick action'))[actionOptionIndex + 1], // + 1 because the Form has an action picker too
  )
  user.click(await findByLabelText(`pick ${targetAction.description}`))

  // Save form

  user.click(await findByLabelText('save question'))
  user.click(await findByLabelText('save form'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPatch.mock.calls[0]

  // Did remove option
  expect(data.questions[0].options.length).toBe(numOptions - 1)

  // Did save correct options
  for (const savedOption of data.questions[0].options) {
    expect(options.includes(savedOption.value)).toBe(true)
  }

  // Did save correct action
  expect(data.questions[0].options[actionOptionIndex].action_id).toBe(
    targetAction.id,
  )
})

it('should add a currency question', async () => {
  const form = fakeForm({questions: []})

  const {findByLabelText, findByText} = await goToForm({
    form,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add question'))

  const label = 'How much money do you want?'
  user.type(await findByLabelText('question label'), label)

  fireEvent.mouseDown(await findByLabelText('question type'))
  user.click(await findByText(/currency/i))

  const currencySymbol = '$$$'
  user.type(await findByLabelText('currency symbol'), currencySymbol)

  user.click(await findByLabelText('save question'))

  // Is displaying question
  expect(await findByText(currencySymbol)).toBeInTheDocument()
})

import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {
  fakeOption,
  fakeQuestion,
} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {RADIO} from 'organization/Event/QuestionsProvider'
import axios from 'axios'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should submit a sponsor form', async () => {
  const button = fakeCardsNavButton({
    page: '/sponsors',
    text: 'Sponsors Page',
  })

  const action = fakeAction()

  const option = fakeOption({
    action_id: action.id,
  })

  const question = fakeQuestion({
    options: [option],
    type: RADIO,
  })

  const form = fakeForm({
    questions: [question],
  })

  const sponsor = fakeSponsor({
    form: form,
  })

  const event = fakeEvent({
    template: fakeCards({
      mainNav: createEntityList([button]),
    }),
    forms: [form],
  })

  const {findByText, findByLabelText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      has_password: true,
      waiver: faker.internet.url(),
      tech_check_completed_at: 'now',
    }),
    event,
  })

  // Sponsors
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [sponsor]}))

  user.click(await findByText(/sponsors page/i))
  user.click(await findByLabelText('sponsor questions'))

  user.click(await findByText(option.value))

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        // Mock answer
        {
          question_id: question.id,
          value: option.value,
        },
      ],
    }),
  )

  // received points
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByText(/submit/i))

  // received points -- ie. show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})

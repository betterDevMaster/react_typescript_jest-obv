import {allTemplates} from 'Event/template/__utils__/tester'
import faker from 'faker'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPosts/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {
  fakeOption,
  fakeQuestion,
} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {RADIO} from 'organization/Event/QuestionsProvider'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'

allTemplates('should render buttons', async (fakeTemplate) => {
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

  const numButtons = faker.random.number({min: 1, max: 4})
  const buttons = Array.from({length: numButtons}, fakeNavButton)

  const post = fakeBlogPost({
    formId: form.id,
    attachment: 'buttons',
    buttons: createHashMap(buttons),
  })

  const event = fakeEvent({
    template: fakeTemplate({
      blogPosts: createHashMap([post]),
    }),
    forms: [form],
  })

  const {findByText, queryByText, findAllByLabelText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      has_password: true,
      waiver: faker.internet.url(),
      tech_check_completed_at: 'now',
    }),
    event,
  })

  expect(await findByText(post.title)).toBeInTheDocument()

  expect((await findAllByLabelText('blog post button')).length).toBe(numButtons)

  expect(queryByText('submit')).not.toBeInTheDocument()
})

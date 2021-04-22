import faker from 'faker'
import {Form} from 'organization/Event/FormsProvider'

export const fakeForm = (overrides?: Partial<Form>): Form => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.random.words(3),
  questions: [],
  can_resubmit: false,
  submission_webhook_url: null,
  on_submit_redirect_url: null,
  action: null,
  infusionsoft_tag_name: null,
  infusionsoft_tag_id: null,
  ...overrides,
})

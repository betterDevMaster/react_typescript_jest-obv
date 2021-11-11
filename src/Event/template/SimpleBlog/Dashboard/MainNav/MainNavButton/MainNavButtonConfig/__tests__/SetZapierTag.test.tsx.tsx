import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import mockAxios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should set a zapier tag', async () => {
  const button = fakeNavButtonWithSize()
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: createEntityList([button]),
    }),
    has_zapier: true,
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const buttonEl = await findByText(button.text)

  const name = faker.random.word()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {name}}))

  clickEdit(buttonEl)

  const tag = 'My Tag'

  user.type(await findByLabelText('zapier tag'), tag)

  user.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const saved = Object.values(data.template.mainNav.entities)[0] as any
  expect(saved.zapierTag).toBe(tag)
})

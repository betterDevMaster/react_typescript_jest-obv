import user from '@testing-library/user-event'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import faker from 'faker'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {clickEdit} from '__utils__/edit'

afterEach(() => {
  jest.clearAllMocks()
})

it('should update welcome Text', async () => {
  const event = fakeEvent({template: fakePanels(), header_background: null})
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('welcome'))

  const welcomeText = faker.random.words(2)

  user.type(await findByLabelText('welcome text'), welcomeText)

  expect((await findByLabelText('welcome')).textContent).toBe(welcomeText)

  //   await wait(() => {
  //     expect(mockPost).toHaveBeenCalledTimes(1)
  //   })

  //   const [url, data] = mockPost.mock.calls[0]

  //   expect(url).toMatch(`/events/${event.slug}`)
  //   expect(data.get('welcomeText')).toBe(welcomeText)
})

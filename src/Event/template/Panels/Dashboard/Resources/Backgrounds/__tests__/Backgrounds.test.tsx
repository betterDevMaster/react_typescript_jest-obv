import {fakeBackground, fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {wait} from '@testing-library/react'
import {eventRoutes, EVENT_PAGES} from 'Event/Routes'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render backgrounds', async () => {
  // Patch fetch to download data
  // @ts-ignore
  window.fetch = jest.fn(() => Promise.resolve({blob: jest.fn(() => [])}))
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const numBackgrounds = faker.random.number({min: 1, max: 4})
  const backgrounds = Array.from({length: numBackgrounds}, fakeBackground)

  const button = fakeNavButtonWithSize({
    page: EVENT_PAGES[eventRoutes.backgrounds],
    text: 'backgrounds',
  })

  const event = fakeEvent({
    backgrounds,
    zoom_backgrounds_title: 'Zoom backgrounds',
    zoom_backgrounds_description: 'description',
    template: fakePanels({
      nav: createEntityList([button]),
    }),
  })

  const {findAllByLabelText, findByLabelText} = await loginToEventSite({
    event,
  })

  user.click(await findByLabelText('panels tab resources'))

  expect((await findAllByLabelText('background image')).length).toBe(
    numBackgrounds,
  )

  /**
   * Test download on click
   */
  user.click((await findAllByLabelText('background image'))[0])

  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })
})

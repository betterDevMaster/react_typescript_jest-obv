import {fakeBackground, fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {wait} from '@testing-library/react'
import {eventRoutes, EVENT_PAGES} from 'Event/Routes'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

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

  const button = fakeCardsNavButton({
    page: EVENT_PAGES[eventRoutes.backgrounds],
    text: 'backgrounds',
  })

  const event = fakeEvent({
    backgrounds,
    zoom_backgrounds_title: 'Zoom backgrounds',
    zoom_backgrounds_description: 'description',
    template: fakeCards({
      mainNav: {buttons: createHashMap([button])},
    }),
  })

  const {findByText, findAllByLabelText} = await loginToEventSite({
    event,
  })

  user.click(await findByText('backgrounds'))

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

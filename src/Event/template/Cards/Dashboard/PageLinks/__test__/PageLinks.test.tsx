import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {loginToEventSite} from 'Event/__utils__/url'

afterEach(() => {
  jest.clearAllMocks()
})

it('should hide link if disbled', async () => {
  const event = fakeEvent({
    template: fakeCards({
      speakers: {
        isVisible: false, // hide speakers
      },
    }),
    logo: null,
  })
  const {queryByLabelText} = await loginToEventSite({
    event,
  })

  await wait(() => {
    expect(queryByLabelText('speakers link')).not.toBeInTheDocument()
  })
})

import axios from 'axios'
import {Sponsor} from 'Event/SponsorPage'
import {loginToEventSite, LoginToEventSiteOptions} from 'Event/__utils__/url'

const mockGet = axios.get as jest.Mock

export async function loginToNiftyFiftySite(
  options: LoginToEventSiteOptions & {
    sponsors?: Sponsor[]
  },
) {
  const sponsors = options.sponsors || []

  return loginToEventSite({
    ...options,
    beforeLogin: () => {
      /**
       * NiftyFifty always fetches sponsors on load since it's a single page,
       * so we need to mock it out here.
       */
      mockGet.mockImplementationOnce(() => Promise.resolve({data: sponsors}))
    },
  })
}

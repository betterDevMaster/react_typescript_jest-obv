import faker from 'faker'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {Sponsor} from 'Event/SponsorPage'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToSponsorConfig} from 'Event/template/Panels/Dashboard/Sponsors/SponsorPageConfig/__utils__/go-to-sponsor-page-config'
import {createEntityList} from 'lib/list'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {clickEdit} from '__utils__/edit'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure sponsor fields', async () => {
  // start with no buttons
  const sponsor = fakeSponsor({image: null, settings: null})

  const event = fakeEvent({
    template: fakePanels(),
  })
  const {findByLabelText, findByText} = await goToSponsorConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    sponsors: [sponsor],
  })

  user.click(await findByLabelText('edit sponsor'))

  const button = fakeNavButton()

  const updated: Sponsor = {
    ...sponsor,
    settings: {
      buttons: createEntityList([button]),
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('add new button'))
  user.click(await findByLabelText('edit button'))

  const buttonText = faker.random.word()
  fireEvent.change(await findByLabelText('button name input'), {
    target: {
      value: buttonText,
    },
  })

  user.click(await findByText(/done/i)) // finish editing button
  user.click(await findByLabelText('save sponsor'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/sponsors/${sponsor.id}`)

  // Did configure button
  expect(
    data.settings.buttons.entities[data.settings.buttons.ids[0]].text,
  ).toBe(buttonText)
})

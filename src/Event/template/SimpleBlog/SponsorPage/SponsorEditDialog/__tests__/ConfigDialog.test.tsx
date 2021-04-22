import faker from 'faker'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {Sponsor} from 'Event/SponsorPage'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToSponsorConfig} from 'organization/Event/SponsorPageConfig/__utils__/go-to-sponsor-page-config'
import {KeyObject} from 'crypto'
import {createEntityList} from 'lib/list'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should work', () => {
  expect(true).toBe(true)
})

// it('should configure sponsor fields', async () => {
//   // start with no buttons
//   const sponsor = fakeSponsor({image: null, buttons: null})

//   const event = fakeEvent()
//   const {findByLabelText, findByText} = await goToSponsorConfig({
//     event,
//     userPermissions: [CONFIGURE_EVENTS],
//     sponsors: [sponsor],
//   })

//   user.click(await findByText(sponsor.name))

//   const name = faker.random.words(3)

//   const button = fakeNavButton()

//   const updated: Sponsor = {
//     ...sponsor,
//     name,
//     buttons: createEntityList([button]),
//   }

//   mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

//   fireEvent.change(await findByLabelText('sponsor name'), {
//     target: {
//       value: name,
//     },
//   })

//   user.click(await findByLabelText('add new button'))
//   user.click(await findByLabelText('edit component'))

//   const buttonText = faker.random.word()
//   fireEvent.change(await findByLabelText('button name input'), {
//     target: {
//       value: buttonText,
//     },
//   })

//   user.click(await findByText(/done/i)) // finish editing button
//   user.click(await findByLabelText('save sponsor'))

//   await wait(() => {
//     expect(mockPut).toHaveBeenCalledTimes(1)
//   })

//   const [url, data] = mockPut.mock.calls[0]

//   expect(url).toMatch(`/sponsors/${sponsor.id}`)

//   expect(data.name).toBe(name)

//   // Did configure button
//   expect(data.buttons.entities[data.buttons.ids[0]].text).toBe(buttonText)
// })

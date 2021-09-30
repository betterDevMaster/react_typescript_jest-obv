import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import {fakeImageEntry} from 'Event/__utils__/factory'

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show entries', async () => {
  const imageEntries = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const {findAllByText} = await goToImageEntries({imageEntries})

  expect((await findAllByText(/approve/i)).length).toBe(imageEntries.length)
})

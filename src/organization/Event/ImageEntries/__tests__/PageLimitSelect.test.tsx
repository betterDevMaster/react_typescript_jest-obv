import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fakeImageEntry} from 'Event/__utils__/factory'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update page limit', async () => {
  const pageOne = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const pageTwo = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const {
    findAllByLabelText,
    findByText,
    event,
    findByLabelText,
  } = await goToImageEntries({
    imageEntries: pageOne,
    hasNextPage: true,
  })

  /**
   * Assert page resets by navigating to a different page
   */

  // Mock page 2
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageTwo,
        has_next_page: false,
      },
    }),
  )

  user.click(await findByText(/next/i))

  await wait(async () => {
    /**
     * Is showing first item from SECOND page
     */
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageTwo[0].file.url})`,
    )
  })

  /**
   * Update page limit
   */

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageOne,
        has_next_page: true,
      },
    }),
  )

  fireEvent.mouseDown(await findByLabelText('set page limit'))
  user.click(await findByText('50'))

  await wait(async () => {
    /**
     * Is showing first item from FIRST page
     */
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageOne[0].file.url})`,
    )
  })

  /**
   * Assert did go to first page (no start id), and updated limit
   */

  const [url] = mockGet.mock.calls[mockGet.mock.calls.length - 1]

  expect(url).toMatch(
    `/events/${event.slug}/image_entries?status=pending&start_id=&limit=50`,
  )
})

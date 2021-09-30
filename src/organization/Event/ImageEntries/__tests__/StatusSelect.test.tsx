import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fakeImageEntry} from 'Event/__utils__/factory'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update status filter', async () => {
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

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageOne,
        has_next_page: true,
      },
    }),
  )

  /**
   * Update status filter
   */

  fireEvent.mouseDown(await findByLabelText('status filter'))
  user.click(await findByText(/approved/i))

  await wait(async () => {
    /**
     * Is showing first item from FIRST page
     */
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageOne[0].file.url})`,
    )
  })

  /**
   * Assert did go to first page (no start id), and updated status
   */

  const [url] = mockGet.mock.calls[mockGet.mock.calls.length - 1]

  expect(url).toMatch(
    `/events/${event.slug}/image_entries?status=approved&start_id=&limit=25`,
  )
})

it('should approve an entry', async () => {})

it('should reject an entry', async () => {})
